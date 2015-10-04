namespace FractalBack
{
    using System.Collections.Generic;

    public interface IFractalDataManager
    {
        IEnumerable<Track> GetTracks();
    }
}