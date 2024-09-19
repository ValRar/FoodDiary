using FoodDiaryWebApi.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace FoodDiaryWebApi.Services
{
    public static class Helpers
    {
        public static IQueryable<NoteEntity> GetByDay(this IQueryable<NoteEntity> notes, long authorId, DateOnly day)
        {
            return notes.AsNoTracking()
                .Include(n => n.Entries)
                .Where(n => n.AuthorId == authorId &&
                    n.CreationTime.DayOfYear == day.DayOfYear &&
                    n.CreationTime.Year == day.Year)
                .OrderByDescending(n => n.CreationTime);
        }
    }
}
