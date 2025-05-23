namespace Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string avatar { get; set; }
        public bool IsAdmin { get; set; }

        public Cart Cart { get; set; }
    }
}
