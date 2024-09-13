using FoodDiaryWebApi.Data.Entities;
using FoodDiaryWebApi.Data.Requests;
using FoodDiaryWebApi.Data.Responses;
using FoodDiaryWebApi.Services.Implementations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
        public ActionResult<IEnumerable<NoteResponse>> GetNotesPage(int page, int pageSize)
        {
            var user = GetUser();
            var notes = _db.Notes.AsNoTracking()
                .Include(n => n.Entries)
                .Where(n => n.AuthorId == user.Id)
                .OrderByDescending(n => n.CreationTime)
                .Skip(pageSize * (page - 1))
                .Take(pageSize)
                .ToList();
            return Ok(notes.Select(NoteResponse.MapFromEntity));
        }
        [HttpGet("{id:}")]
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
