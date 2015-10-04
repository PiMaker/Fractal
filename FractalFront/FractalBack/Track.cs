namespace FractalBack
{
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;

    using Newtonsoft.Json;

    using File = TagLib.File;

    public class Track
    {
        [JsonIgnore]
        private readonly string filename;

        public Track(string filename)
        {
            this.filename = filename;
            var tagFile = File.Create(filename);
            this.ID3Tags =
                tagFile.Tag.GetType()
                    .GetProperties()
                    .ToDictionary(
                        tagProperty => tagProperty.Name,
                        tagProperty =>
                        tagProperty.PropertyType == typeof(string)
                            ? (string)tagProperty.GetValue(tagFile.Tag)
                            : string.Empty)
                    .Where(x => !string.IsNullOrEmpty(x.Value))
                    .ToDictionary(x => x.Key, x => x.Value);
        }

        [JsonIgnore]
        public static string BaseURL { get; set; } = string.Empty;

        public string Filename => Path.GetFileNameWithoutExtension(this.filename);

        public IReadOnlyDictionary<string, string> ID3Tags { get; }

        public string URL
        {
            get
            {
                var localFileName =
                    this.filename.Substring(this.filename.LastIndexOf("wwwroot") + 8)
                        .Replace(Path.DirectorySeparatorChar.ToString(), "/");

                if (!Track.BaseURL.EndsWith("/"))
                {
                    Track.BaseURL += "/";
                }

                return Track.BaseURL + localFileName;
            }
        }
    }
}