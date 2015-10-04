namespace FractalBack
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    public class FractalDataManager : IFractalDataManager
    {
        public IEnumerable<Track> GetTracks()
        {
            return
                Directory.GetFiles(Startup.PathToWWWRoot, "*.mp3", SearchOption.AllDirectories)
                    .Select(mp3File => new Track(mp3File));
        }
    }
}