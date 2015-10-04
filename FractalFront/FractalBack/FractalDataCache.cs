namespace FractalBack
{
    using System;
    using System.Collections.Generic;

    public class FractalDataCache : IFractalDataManager
    {
        private const int EXPIRATION_MINUTES = 60;

        private readonly IFractalDataManager source;

        private IEnumerable<Track> cache;

        private DateTime lastSync;

        public FractalDataCache(IFractalDataManager source)
        {
            this.source = source;
        }

        public IEnumerable<Track> GetTracks()
        {
            if (this.cache == null || (DateTime.Now - this.lastSync).TotalMinutes > FractalDataCache.EXPIRATION_MINUTES)
            {
                this.Sync();
            }

            return this.cache;
        }

        public void Sync()
        {
            this.cache = this.source.GetTracks();
            this.lastSync = DateTime.Now;
        }
    }
}