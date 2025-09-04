export default function ArtistGrid() {
  const popularArtists = [
    { id: "1", name: "The Weeknd", image: "/placeholder-artist.jpg" },
    { id: "2", name: "Billie Eilish", image: "/placeholder-artist.jpg" },
    { id: "3", name: "Drake", image: "/placeholder-artist.jpg" },
    { id: "4", name: "Taylor Swift", image: "/placeholder-artist.jpg" },
    { id: "5", name: "Dua Lipa", image: "/placeholder-artist.jpg" },
    { id: "6", name: "Post Malone", image: "/placeholder-artist.jpg" },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6" data-testid="text-artists-title">Popular artists</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {popularArtists.map((artist) => (
          <div 
            key={artist.id}
            className="album-card bg-card p-4 rounded-lg cursor-pointer hover:bg-card/80 transition-all"
            data-testid={`card-artist-${artist.id}`}
          >
            <div className="w-full aspect-square bg-muted rounded-full mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold text-center" data-testid={`text-artist-name-${artist.id}`}>
              {artist.name}
            </h3>
            <p className="text-sm text-muted-foreground text-center" data-testid={`text-artist-type-${artist.id}`}>
              Artist
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
