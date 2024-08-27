namespace FoodDiaryWebApi.Services.Implementations
{
    public static class GigachatJWTStorage
    {
        private static object _lock = new object();
        private static string? _token;
        public static string? Token
        {
            get
            {
                while (Monitor.IsEntered(_lock))
                    Thread.Sleep(10);
                return _token;
            }
            set
            {
                try
                {
                    Monitor.Enter(_lock);
                    _token = value;
                } finally { Monitor.Exit(_lock); }
            }
        }
    }
}
