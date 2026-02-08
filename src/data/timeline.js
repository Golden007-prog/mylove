// Timeline synchronized to "Perfect" by Ed Sheeran
// Synced from complete_lyrics.csv - exact timestamps
// Loading: 0-20.5s | Video: 20.5-51.5s | Cards: 51.5-264s | Shore: 264-272s | Proposal: 272s+

// Lyrics for background texture
export const lyrics = `I found a love for me, Darling just dive right in and follow my lead
Well I found a girl beautiful and sweet, Oh I never knew you were the someone waiting for me
Cause we were just kids when we fell in love, Not knowing what it was
I will not give you up this time, Darling just kiss me slow
Baby I'm dancing in the dark, With you between my arms
Barefoot on the grass, Listening to our favourite song`;

// Phase timing constants
// Video: 0:20-0:57 (user corrected: 20→36→41, ends at 57s)
// Cards: 0:57 onwards
export const LOADING_END_TIME = 20;        // Loading screen ends, video starts
export const VIDEO_START_TIME = 20;        // Video + lyrics start
export const VIDEO_END_TIME = 59;          // Video ends after "Not knowing what it was"
export const JOURNEY_START_TIME = 61;      // Cards start
export const SHORE_TIME = 259;             // Shore scene starts (after last card at 255s)
export const PROPOSAL_TIME = 267;          // Proposal card appears
export const SONG_DURATION = 282.0;        // Music fade out

// Timeline - Card lyrics (starts at 57s after video ends)
// Timestamps are auto-calculated from CSV's Vocal_Duration, starting at VIDEO_END_TIME (57s)
// Each timeStart = previous timeStart + previous lyric's duration
export const timeline = [
  // === First section: 63s → 111.8s (Chorus 1) ===
  // 63s (User-synced perfect timing)

  { timeStart: 63, lyric: "I will not give you up this time", photo: "/photos/1 .jpg", type: "photo" },     // dur: 5.0
  
  // 68s (63 + 5.0)
  { timeStart: 68, lyric: "But darling, just kiss me slow", photo: "/photos/2.jpeg", type: "sticky" },      // dur: 4.8
  
  // 72.8s (68 + 4.8)
  { timeStart: 72.8, lyric: "Your heart is all I own", photo: "/photos/3.jpeg", type: "photo" },            // dur: 4.6
  
  // 77.4s (72.8 + 4.6)
  { timeStart: 77.4, lyric: "And in your eyes, you're holding mine", photo: "/photos/4.jpeg", type: "photo" }, // dur: 4.4
  
  // 81.8s (77.4 + 4.4)
  { timeStart: 80.0, lyric: "Baby, I'm dancing in the dark", photo: "/photos/5.jpeg", type: "photo" },      // dur: 4.0
  
  // 89.8s (User-synced perfect timing)
  { timeStart: 89.8, lyric: "With you between my arms", photo: "/photos/6.jpeg", type: "sticky" },          // dur: 4.0
  
  // 93.8s (89.8 + 4.0)
  { timeStart: 93.8, lyric: "Barefoot on the grass", type: "lyric" },                                        // dur: 2.8
  
  // 96.6s (93.8 + 2.8)
  { timeStart: 96.6, lyric: "Listening to our favorite song", photo: "/photos/7.jpeg", type: "photo" },     // dur: 3.4
  
  // 100s (96.6 + 3.4)
  { timeStart: 100, lyric: "When you said you looked a mess", type: "lyric" },                                // dur: 3.7
  
  // 103.7s (100 + 3.7)
  { timeStart: 103.7, lyric: "I whispered underneath my breath", photo: "/photos/8.jpeg", type: "photo" },   // dur: 3.4
  
  // 107.1s (103.7 + 3.4)
  { timeStart: 107.1, lyric: "But you heard it", type: "lyric" },                                             // dur: 3.5
  
  // 110.6s (107.1 + 3.5)
  { timeStart: 110.6, lyric: "Darling, you look perfect tonight", photo: "/photos/9.jpeg", type: "sticky" }, // dur: 5.2
  
  // === Instrumental Gap: 115.8s → 136s ===
  
  // === Verse 2: 120s → 167s ===
  // 120s (User-synced perfect timing)
  { timeStart: 120, lyric: "Well, I found a woman, stronger than anyone I know", photo: "/photos/10.jpeg", type: "photo" }, // dur: 6.0
  
  // 126s (120 + 6.0)
  { timeStart: 128, lyric: "She shares my dreams, I hope that someday I'll share her home", photo: "/photos/11.jpeg", type: "photo" }, // dur: 5.3
  
  // 134.3s (User-synced perfect timing)
  { timeStart: 134.3, lyric: "I found a love to carry more than just my secrets", photo: "/photos/12.jpeg", type: "sticky" }, // dur: 5.9
  
  // 143.2s (User-synced perfect timing)
  { timeStart: 143.2, lyric: "To carry love, to carry children of our own", type: "lyric" },                 // dur: 5.1
  
  // 148.3s (143.2 + 5.1)
  { timeStart: 148.3, lyric: "We are still kids, but we're so in love", photo: "/photos/13.jpeg", type: "photo" }, // dur: 5.2
  
  // 154.5s (User-synced perfect timing)
  { timeStart: 154.5, lyric: "Fighting against all odds", type: "lyric" },                                    // dur: 4.7
  
  // 159.2s (154.5 + 4.7)
  { timeStart: 159.2, lyric: "I know we'll be alright this time", photo: "/photos/14.jpeg", type: "photo" }, // dur: 5.3
  
  // 164.5s (159.2 + 5.3)
  { timeStart: 165.5, lyric: "Darling, just hold my hand", type: "lyric" },                                   // dur: 3.0
  
  // 169.5s (User-synced perfect timing)
  { timeStart: 169.5, lyric: "Be my girl, I'll be your man", photo: "/photos/15.jpeg", type: "sticky" },     // dur: 2.8
  
  // 175.3s (User-synced perfect timing)
  { timeStart: 175.3, lyric: "I see my future in your eyes", type: "lyric" },                                 // dur: 3.7
  
  // === Chorus 2: 179s → 207.6s ===
  // 179s (175.3 + 3.7)
  { timeStart: 181, lyric: "Baby, I'm dancing in the dark", photo: "/photos/16.jpeg", type: "photo" },       // dur: 4.0
  
  // 183s (179 + 4.0)
  { timeStart: 187, lyric: "With you between my arms", photo: "/photos/17.jpeg", type: "sticky" },           // dur: 3.4
  
  // 193.4s (User-synced perfect timing)
  { timeStart: 193.4, lyric: "Barefoot on the grass", type: "lyric" },                                        // dur: 2.7
  
  // 196.1s (193.4 + 2.7)
  { timeStart: 196.1, lyric: "Listening to our favorite song", photo: "/photos/18.jpeg", type: "photo" },    // dur: 4.6
  
  // 200.7s (196.1 + 4.6)
  { timeStart: 200.7, lyric: "When I saw you in that dress, looking so beautiful", type: "lyric" },          // dur: 4.2
  
  // 204.9s (200.7 + 4.2)
  { timeStart: 204.9, lyric: "I don't deserve this", type: "lyric" },                                         // dur: 4.6
  
  // 209.5s (204.9 + 4.6)
  { timeStart: 209.5, lyric: "Darling, you look perfect tonight", photo: "/photos/19.jpeg", type: "sticky" }, // dur: 5.1
  
  // === Instrumental: 214.6s → 240s ===
  // === Final Chorus: 230s → 257s ===
  // 230s (User-synced perfect timing)
  { timeStart: 230, lyric: "Baby, I'm dancing in the dark", photo: "/photos/20.jpeg", type: "photo" },       // dur: 4.1
  
  // 234.1s (230 + 4.1)
  { timeStart: 234.1, lyric: "With you between my arms", type: "lyric" },                                     // dur: 3.4
  
  // 237.5s (234.1 + 3.4)
  { timeStart: 237.5, lyric: "Barefoot on the grass", type: "lyric" },                                        // dur: 3.0
  
  // 240.5s (237.5 + 3.0)
  { timeStart: 240.5, lyric: "Listening to our favorite song", type: "lyric" },                               // dur: 5.0
  
  // 245.5s (240.5 + 5.0)
  { timeStart: 245.5, lyric: "I have faith in what I see", type: "lyric" },                                   // dur: 4.1
  
  // 249.6s (245.5 + 4.1)
  { timeStart: 249.6, lyric: "Now I know I have met an angel in person", photo: "/photos/21.jpeg", type: "photo" }, // dur: 4.6
  
  // 254.2s (249.6 + 4.6)
  { timeStart: 256.2, lyric: "And she looks perfect", type: "lyric" },                                        // dur: 2.7
  
  // 256.9s (254.2 + 2.7)
  { timeStart: 262.9, lyric: "You look perfect tonight", photo: "/photos/22.jpeg", type: "sticky" },         // dur: 4.0
];
