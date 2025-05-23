namespace Application.DTOs.Item
{
    public class ItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public string? ImageUrl { get; set; }
        public int Department_id { get; set; }
    }
}
