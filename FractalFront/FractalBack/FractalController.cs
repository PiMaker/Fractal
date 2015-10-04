namespace FractalBack
{
    using Microsoft.AspNet.Mvc;

    [Route("")]
    public class FractalController : Controller
    {
        private readonly IFractalDataManager dataManager;

        public FractalController(IFractalDataManager dataManager)
        {
            this.dataManager = dataManager;
        }

        public string RawUrl => this.Request.Scheme + "://" + this.Request.Host;

        [HttpGet]
        public IActionResult Index()
        {
            Track.BaseURL = this.RawUrl;
            return new JsonResult(this.dataManager.GetTracks());
        }

        [HttpGet("Sync")]
        public IActionResult Sync()
        {
            var cache = this.dataManager as FractalDataCache;
            if (cache == null)
            {
                return new HttpStatusCodeResult(500);
            }

            cache.Sync();
            return new HttpStatusCodeResult(200);
        }
    }
}