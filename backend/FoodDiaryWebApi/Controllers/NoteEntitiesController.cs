using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Data.Requests;
using FoodDiaryWebApi.Data.Responses;
using FoodDiaryWebApi.Services.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace FoodDiaryWebApi.Controllers
{
    [Route("notes")]
    [ApiController]
    [Authorize]
    public class NoteEntitiesController : ControllerBase
    {
        private readonly FoodDiaryDbContext _db;

        public NoteEntitiesController(FoodDiaryDbContext context)
        {
            _db = context;
        }
        [HttpGet("get_page")]
        public ActionResult<IEnumerable<NoteResponse>> GetNotesPage([Required] int minimum_length, [Required] DateOnly start_day)
        {
            var startDateTime = start_day.ToDateTime(TimeOnly.MaxValue).ToUniversalTime(); 
            var user = GetUser();
            var minimumNotes = _db.Notes.AsNoTracking()
                .Include(n => n.Entries)
                .Where(n => n.AuthorId == user.Id && n.CreationTime <= startDateTime)
                .OrderByDescending(n => n.CreationTime)
                .Take(minimum_length)
                .ToList();
            if (minimumNotes.Count() >= minimum_length)
            {
                var lastDate = minimumNotes.Last().CreationTime;
                minimumNotes.AddRange(
                    _db.Notes.Where(n => n.CreationTime.DayOfYear == lastDate.DayOfYear && 
                    n.CreationTime.Year == lastDate.Year && 
                    n.AuthorId == user.Id &&
                    n.CreationTime.TimeOfDay < lastDate.TimeOfDay)
                    .Include(n => n.Entries)
                    .OrderByDescending(n => n.CreationTime)
                    .ToArray()
                    );
            }
            return Ok(minimumNotes.Select(NoteResponse.MapFromEntity));
        }
        [HttpGet("{id:int}")]
        public ActionResult<NoteResponse> GetNote(int id)
        {
            var user = GetUser();
            var note = _db.Notes.AsNoTracking()
                .Include(n => n.Entries)
                .Where(n => n.Id == id && n.AuthorId == user.Id)
                .FirstOrDefault();
            if (note is null)
                return Forbid();
            return Ok(NoteResponse.MapFromEntity(note));
        }
        [HttpPost]
        public async Task<ActionResult<NoteResponse>> AddNote(NoteAddRequest request)
        {
            var user = GetUser();
            var noteEntity = new NoteEntity
            {
                AuthorId = user.Id,
                CreationTime = DateTime.UtcNow,
                Entries = request.Entries.Select(NoteEntryEntity.MapFromDTO).ToList(),
            };
            _db.Notes.Add(noteEntity);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(AddNote), NoteResponse.MapFromEntity(noteEntity));
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditNote(int id, NoteAddRequest request)
        {
            var user = GetUser();
            var noteForEditing = _db.Notes.Include(n => n.Entries).Where(n => n.Id == id && n.AuthorId == user.Id).FirstOrDefault();
            if (noteForEditing is null)
                return Forbid();
            noteForEditing.Entries.ForEach(e => _db.Entry(e).State = EntityState.Deleted);
            noteForEditing.Entries = request.Entries.Select(NoteEntryEntity.MapFromDTO).ToList();
            await _db.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var user = GetUser();
            var note = _db.Notes.Include(n => n.Entries).Where(n => n.Id == id && n.AuthorId == user.Id).FirstOrDefault();
            if (note is null)
                return Forbid();
            note.Entries.ForEach(e => _db.Entry(e).State = EntityState.Deleted);
            _db.Notes.Remove(note);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        private string GetUserEmail() => HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Email).Value;
        private UserEntity GetUser(string email) => _db.Users.AsNoTracking().First(u => u.Email == email);
        private UserEntity GetUser() => _db.Users.AsNoTracking().First(u => u.Email == GetUserEmail());
    }
}
