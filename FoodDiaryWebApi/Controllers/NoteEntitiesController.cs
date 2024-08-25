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
        [HttpGet("get")]
        public ActionResult<NoteResponse> GetNotes(int page, int pageSize)
        {
            var userEmail = GetUserEmail();
            var user = _db.Users.AsNoTracking().Include(u => u.Notes).First(u => u.Email == userEmail);
            var notes = user.Notes.OrderBy(n => n.CreationTime).Skip(pageSize * (page - 1)).Take(pageSize).ToArray();
            return Ok(notes.Select(MapNoteEntity));
        }
        [HttpPost]
        public async Task<IActionResult> AddNote(NoteAddRequest request)
        {
            var userEmail = GetUserEmail();
            var user = _db.Users.First(u => u.Email == userEmail);
            var noteEntity = new NoteEntity()
            {
                CreationTime = DateTime.UtcNow,
                Text = request.Content,
                CaloriesAmount = request.Calories
            };
            user.Notes.Add(noteEntity);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(AddNote), MapNoteEntity(noteEntity));
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> EditNoteAsync(int id, NoteAddRequest note)
        {
            var userEmail = GetUserEmail();
            var user = _db.Users.Include(u => u.Notes).First(u => u.Email == userEmail);
            var noteForEditing = user.Notes.FirstOrDefault(n => n.Id == id);
            if (noteForEditing is null)
                return Forbid();
            if (note.Calories is not null)
                noteForEditing.CaloriesAmount = note.Calories;
            noteForEditing.Text = note.Content;
            await _db.SaveChangesAsync();
            return NoContent();
        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteNote(int id)
        {
            var userEmail = GetUserEmail();
            var user = _db.Users.Include(u => u.Notes).First(u => u.Email == userEmail);
            var note = user.Notes.FirstOrDefault(n => n.Id == id);
            if (note is null)
                return Forbid();
            user.Notes.Remove(note);
            await _db.SaveChangesAsync();
            return NoContent();
        }
        private string GetUserEmail() => HttpContext.User.Claims.First(c => c.Type == ClaimTypes.Email).Value;
        private NoteResponse MapNoteEntity(NoteEntity entity) => new NoteResponse()
        {
            Id = entity.Id,
            Calories = entity.CaloriesAmount,
            Content = entity.Text,
            CreationTime = entity.CreationTime
        };
    }
}
