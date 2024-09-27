
using FoodDiaryWebApi.Data.DTO;
using FoodDiaryWebApi.Data.Entities;

namespace FoodDiaryWebApi.Data.Responses
{
    public class NoteResponse
    {
        public static NoteResponse MapFromEntity(NoteEntity entity)
        {
            return new NoteResponse
            {
                Id = entity.Id,
                CreationTime = entity.CreationTime,
                Entries = entity.Entries.Select(NoteEntry.MapFromEntity).ToArray(),
            };
        }
        public long Id { get; set; }
        public NoteEntry[] Entries { get; set; }
        public DateTime CreationTime { get; set; }
    }
}
