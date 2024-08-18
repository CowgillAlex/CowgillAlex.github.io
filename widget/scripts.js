const tracks = [
    
    { path: 'music/A Familiar Room.mp3', title: 'A Familiar Room', creator: 'Aaron Cherof' },
    { path: 'music/Aerie.mp3', title: 'Aerie', creator: 'Lena Raine' },
    { path: 'music/An Ordinary Day.mp3', title: 'An Ordinary Day', creator: 'Kumi Tanioka' },
    { path: 'music/Ancestry.mp3', title: 'Ancestry', creator: 'Lena Raine' },
    { path: 'music/Aria Math.mp3', title: 'Aria Math', creator: 'C418' },
    { path: 'music/Axolotl.mp3', title: 'Axolotl', creator: 'C418' },
    { path: 'music/Ballad of the Cats.mp3', title: 'Ballad of the Cats', creator: 'C418' },
    { path: 'music/Beginning 2.mp3', title: 'Beginning 2', creator: 'C418' },
    { path: 'music/Biome Fest.mp3', title: 'Biome Fest', creator: 'C418' },
    { path: 'music/Blind Spots.mp3', title: 'Blind Spots', creator: 'C418' },
    { path: 'music/Bromeliad.mp3', title: 'Bromeliad', creator: 'Aaron Cherof' },
    { path: 'music/Chrysopoeia.mp3', title: 'Chrysopoeia', creator: 'Lena Raine' },
    { path: 'music/Clark.mp3', title: 'Clark', creator: 'C418' },
    { path: 'music/Comforting Memories.mp3', title: 'Comforting Memories', creator: 'Kumi Tanioka' },
    { path: 'music/Concrete Halls.mp3', title: 'Concrete Halls', creator: 'C418' },

    { path: 'music/Crescent Dunes.mp3', title: 'Crescent Dunes', creator: 'Aaron Cherof' },
    { path: 'music/Danny.mp3', title: 'Danny', creator: 'C418' },
    { path: 'music/Dead Voxel.mp3', title: 'Dead Voxel', creator: 'C418' },
    { path: 'music/deeper.mp3', title: 'Deeper', creator: 'Lena Raine' },
    { path: 'music/Dragon Fish.mp3', title: 'Dragon Fish', creator: 'C418' },
    { path: 'music/Dreiton.mp3', title: 'Dreiton', creator: 'C418' },
    { path: 'music/Dry Hands.mp3', title: 'Dry Hands', creator: 'C418' },
    { path: 'music/Echo in the Wind.mp3', title: 'Echo in the Wind', creator: 'Aaron Cherof' },
    { path: 'music/EldUnknown.mp3', title: 'EldUnknown', creator: 'Lena Raine' },
    { path: 'music/Endless.mp3', title: 'Endless', creator: 'Lena Raine' },
    { path: 'music/Firebugs.mp3', title: 'Firebugs', creator: 'Lena Raine' },
  
    { path: 'music/Floating Dream.mp3', title: 'Floating Dream', creator: 'Kumi Tanioka' },
    { path: 'music/Floating Trees.mp3', title: 'Floating Trees', creator: 'C418' },
    { path: 'music/fratherfall.mp3', title: 'fratherfall', creator: 'Aaron Cherof' },
    { path: 'music/Haggstrom.mp3', title: 'Haggstrom', creator: 'C418' },
    { path: 'music/Haunt Muskie.mp3', title: 'Haunt Muskie', creator: 'C418' },
    { path: 'music/Infinite Amethyst.mp3', title: 'Infinite Amethyst', creator: 'Lena Raine' },
    { path: 'music/Key.mp3', title: 'Key', creator: 'C418' },
    { path: 'music/komorebi.mp3', title: 'Komorebi', creator: 'Kumi Tanioka' },
    { path: 'music/Labyrinthine.mp3', title: 'Labyrinthine', creator: 'Lena Raine' },
    { path: 'music/Left to Bloom.mp3', title: 'Left to Bloom', creator: 'Lena Raine' },
    { path: 'music/Living Mice.mp3', title: 'Living Mice', creator: 'C418' },
    { path: 'music/Mice On Venus.mp3', title: 'Mice On Venus', creator: 'C418' },
    { path: 'music/Minecraft.mp3', title: 'Minecraft', creator: 'C418' },
    { path: 'music/Moog City 2.mp3', title: 'Moog City 2', creator: 'C418' },
    { path: 'music/Mutation.mp3', title: 'Mutation', creator: 'C418' },
    { path: 'music/One More Day.mp3', title: 'One More Day', creator: 'Lena Raine' },
    { path: 'music/otherside.mp3', title: 'Otherside', creator: 'Lena Raine' },
    { path: 'music/Oxygène.mp3', title: 'Oxygène', creator: 'C418' },
   
    { path: 'music/pokopoko.mp3', title: 'Pokopoko', creator: 'Kumi Tanioka' },
 
    { path: 'music/Puzzlebox.mp3', title: 'Puzzlebox', creator: 'Aaron Cherof' },

    { path: 'music/Rubedo.mp3', title: 'Rubedo', creator: 'Lena Raine' },
    { path: 'music/Shuniji.mp3', title: 'Shuniji', creator: 'C418' },
    { path: 'music/So Below.mp3', title: 'So Below', creator: 'Lena Raine' },
    { path: 'music/Stand Tall.mp3', title: 'Stand Tall', creator: 'Lena Raine' },
    { path: 'music/Subwoofer Lullaby.mp3', title: 'Subwoofer Lullaby', creator: 'C418' },
    { path: 'music/Sweden.mp3', title: 'Sweden', creator: 'C418' },
    { path: 'music/Taswell.mp3', title: 'Taswell', creator: 'C418' },
    { path: 'music/Watcher.mp3', title: 'Watcher', creator: 'Aaron Cherof' },
    { path: 'music/Wending.mp3', title: 'Wending', creator: 'Lena Raine' },
    { path: 'music/Wet Hands.mp3', title: 'Wet Hands', creator: 'C418' },
    { path: 'music/yakusoku.mp3', title: 'Yakusoku', creator: 'Kumi Tanioka' },
    
];
let currentTrackIndex = 0;
const audioPlayer = document.getElementById('audio-player');
const musicInfo = document.getElementById('music-info');

function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.path;
    musicInfo.textContent = `${track.title} | ${track.creator}`;
}

function shuffleTracks() {
    for (let i = tracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    }
}

function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
}

document.addEventListener('DOMContentLoaded', () => {
    shuffleTracks();
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    audioPlayer.addEventListener('ended', playNextTrack);
});