/* ==========================================================================
   MORSE SPACE CADET - MORSE DATA, LESSONS & MNEMONICS
   ========================================================================== */

const MORSE = {
  // Alphabet
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",

  // Numbers
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",

  // Punctuation
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "=": "-...-"
};

// Reverse map for decoding
const REVERSE_MORSE = {};
Object.entries(MORSE).forEach(([char, code]) => {
  REVERSE_MORSE[code] = char;
});

// Convert standard dots/dashes to visual symbols
function formatMorseSymbols(code) {
  if (!code) return "";
  return code.replaceAll(".", "•").replaceAll("-", "—");
}

/* ==========================================================================
   13 KOCH METHOD LESSONS
   ========================================================================== */
const LESSONS_DATA = [
  {
    level: 1,
    name: "Tín Hiệu Đầu Tiên",
    newLetters: ["E", "T"],
    letters: ["E", "T"],
    desc: "Làm quen với Chấm ngắn (E) và Gạch dài (T)."
  },
  {
    level: 2,
    name: "Bốn Tín Hiệu Cơ Bản",
    newLetters: ["A", "N"],
    letters: ["E", "T", "A", "N"],
    desc: "Mở rộng với A (•—) và N (—•)."
  },
  {
    level: 3,
    name: "Tân Binh Không Gian",
    newLetters: ["I", "M"],
    letters: ["E", "T", "A", "N", "I", "M"],
    desc: "Thêm I (••) và M (——) cho nhịp điệu."
  },
  {
    level: 4,
    name: "Nhà Thám Hiểm Sóng",
    newLetters: ["S", "O"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O"],
    desc: "Học tín hiệu huyền thoại SOS (S •••, O ———)."
  },
  {
    level: 5,
    name: "Điệp Viên Radar",
    newLetters: ["R", "K"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K"],
    desc: "Phản xạ nhanh với R (•—•) và K (—•—)."
  },
  {
    level: 6,
    name: "Trinh Sát Vũ Trụ",
    newLetters: ["D", "G"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G"],
    desc: "Giải mã các âm thanh trầm D (—••) và G (——•)."
  },
  {
    level: 7,
    name: "Phi Công Phi Thuyền",
    newLetters: ["U", "W"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W"],
    desc: "Chinh phục U (••—) và W (•——)."
  },
  {
    level: 8,
    name: "Thợ Săn Tín Hiệu",
    newLetters: ["H", "V"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V"],
    desc: "H (••••) 4 chấm dồn dập và V (•••—) khúc khải hoàn."
  },
  {
    level: 9,
    name: "Nhà Du Hành Morse",
    newLetters: ["F", "L"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V", "F", "L"],
    desc: "Luyện đôi tai sắc bén với F (••—•) và L (•—••)."
  },
  {
    level: 10,
    name: "Chỉ Huy Trạm Không Gian",
    newLetters: ["P", "J"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V", "F", "L", "P", "J"],
    desc: "Phát âm dài P (•——•) và J (•———)."
  },
  {
    level: 11,
    name: "Cao Thủ Mật Mã",
    newLetters: ["B", "X"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V", "F", "L", "P", "J", "B", "X"],
    desc: "Giải mã B (—•••) và X (—••—)."
  },
  {
    level: 12,
    name: "Chuyên Gia Radar",
    newLetters: ["C", "Y"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V", "F", "L", "P", "J", "B", "X", "C", "Y"],
    desc: "Chuẩn bị về đích với C (—•—•) và Y (—•——)."
  },
  {
    level: 13,
    name: "Đại Sứ Morse Vũ Trụ",
    newLetters: ["Z", "Q"],
    letters: ["E", "T", "A", "N", "I", "M", "S", "O", "R", "K", "D", "G", "U", "W", "H", "V", "F", "L", "P", "J", "B", "X", "C", "Y", "Z", "Q"],
    desc: "Mở khóa toàn bộ 26 chữ cái với Z (——••) và Q (——•—)!"
  }
];

// Build Full Level Array with Interleaved Boss Review Challenges
const LEVELS_LIST = [];
LESSONS_DATA.forEach((lesson, index) => {
  LEVELS_LIST.push({
    ...lesson,
    type: "lesson",
    levelNumber: LEVELS_LIST.length + 1
  });

  // After every 2 lessons, insert a Boss Review Challenge
  if ((index + 1) % 2 === 0) {
    const challengeNum = (index + 1) / 2;
    LEVELS_LIST.push({
      type: "challenge",
      challengeId: challengeNum,
      levelNumber: LEVELS_LIST.length + 1,
      name: `⚡ Thử Thách Boss ${challengeNum}`,
      newLetters: [],
      letters: [...lesson.letters],
      desc: `Ôn tập tổng hợp cấp độ 1 đến ${index + 1}. Có 3 Tim!`
    });
  }
});

/* ==========================================================================
   VISUAL MNEMONICS (HÌNH GỢI NHỚ TRẺ EM)
   ========================================================================== */
const MNEMONICS = {
  A: { icon: "✈️", word: "Airplane", hint: "Máy bay cất cánh (ngắn - dài)", code: ".-" },
  B: { icon: "🍌", word: "Banana", hint: "Một nải chuối (dài - ngắn - ngắn - ngắn)", code: "-..." },
  C: { icon: "🍬", word: "Candy", hint: "Kẹo ngọt ngào (dài - ngắn - dài - ngắn)", code: "-.-." },
  D: { icon: "🐶", word: "Dog", hint: "Chú cún vẫy đuôi (dài - ngắn - ngắn)", code: "-.." },
  E: { icon: "👁️", word: "Eye", hint: "Một chớp mắt ngắn (chấm)", code: "." },
  F: { icon: "🦊", word: "Fox", hint: "Cáo thông minh (ngắn - ngắn - dài - ngắn)", code: "..-." },
  G: { icon: "🦒", word: "Giraffe", hint: "Hươu cao cổ (dài - dài - ngắn)", code: "--." },
  H: { icon: "🏠", word: "Home", hint: "4 bức tường nhà (4 chấm)", code: "...." },
  I: { icon: "🍦", word: "Ice cream", hint: "2 viên kem ngon (2 chấm)", code: ".." },
  J: { icon: "🤹", word: "Juggler", hint: "Tung 3 bóng dài (ngắn - dài - dài - dài)", code: ".---" },
  K: { icon: "🦘", word: "Kangaroo", hint: "Chuột túi nhảy (dài - ngắn - dài)", code: "-.-" },
  L: { icon: "🍋", word: "Lemon", hint: "Quả chanh mọng (ngắn - dài - ngắn - ngắn)", code: ".-.." },
  M: { icon: "🌙", word: "Moon", hint: "2 vầng trăng sáng (2 gạch)", code: "--" },
  N: { icon: "🥜", word: "Nut", hint: "Hạt dẻ cắn đôi (dài - ngắn)", code: "-." },
  O: { icon: "🦉", word: "Owl", hint: "Cú mèo cú vọ (3 gạch dài)", code: "---" },
  P: { icon: "🐧", word: "Penguin", hint: "Chim cánh cụt (ngắn - dài - dài - ngắn)", code: ".--." },
  Q: { icon: "👑", word: "Queen", hint: "Vương miện lấp lánh (dài - dài - ngắn - dài)", code: "--.-" },
  R: { icon: "🤖", word: "Robot", hint: "Robot Beep-Bot (ngắn - dài - ngắn)", code: ".-." },
  S: { icon: "🍓", word: "Strawberry", hint: "3 quả dâu tây (3 chấm)", code: "..." },
  T: { icon: "🌲", word: "Tree", hint: "Thân cây thẳng đứng (1 gạch)", code: "-" },
  U: { icon: "🦄", word: "Unicorn", hint: "Kỳ lân kỳ diệu (ngắn - ngắn - dài)", code: "..-" },
  V: { icon: "🎻", word: "Violin", hint: "Nhạc giao hưởng (3 ngắn - 1 dài)", code: "...-" },
  W: { icon: "🌊", word: "Wave", hint: "Sóng biển dập dềnh (ngắn - dài - dài)", code: ".--" },
  X: { icon: "⚔️", word: "Xylophone", hint: "Hai thanh kiếm chéo (dài - 2 ngắn - dài)", code: "-..-" },
  Y: { icon: "⛵", word: "Yacht", hint: "Thuyền buồm ra khơi (dài - ngắn - 2 dài)", code: "-.--" },
  Z: { icon: "🦓", word: "Zebra", hint: "Ngựa vằn dũng cảm (2 dài - 2 ngắn)", code: "--.." }
};

/* ==========================================================================
   SECRET WORDS FOR WORD DECODER MISSION
   ========================================================================== */
const SECRET_WORDS = [
  // Cấp độ 1: 2-3 chữ cái
  { word: "HI", clue: "Lời chào thân thiện!", category: "Giao tiếp", icon: "👋" },
  { word: "SOS", clue: "Tín hiệu cấp cứu vũ trụ!", category: "Khẩn cấp", icon: "🆘" },
  { word: "CAT", clue: "Bạn mèo kêu meo meo", category: "Động vật", icon: "🐱" },
  { word: "DOG", clue: "Bạn cún trung thành", category: "Động vật", icon: "🐶" },
  { word: "SUN", clue: "Mặt trời ấm áp", category: "Vũ trụ", icon: "☀️" },
  { word: "EGG", clue: "Quả trứng nở ra chim non", category: "Thức ăn", icon: "🥚" },
  { word: "ICE", clue: "Đá lạnh mát rượi", category: "Thiên nhiên", icon: "🧊" },
  { word: "RED", clue: "Màu đỏ rực rỡ", category: "Màu sắc", icon: "🔴" },
  { word: "FOX", clue: "Cáo thông minh nhanh nhẹn", category: "Động vật", icon: "🦊" },

  // Cấp độ 2: 4 chữ cái
  { word: "STAR", clue: "Ngôi sao lấp lánh trên trời", category: "Vũ trụ", icon: "⭐" },
  { word: "MOON", clue: "Mặt trăng tròn đêm rằm", category: "Vũ trụ", icon: "🌙" },
  { word: "SHIP", clue: "Phi thuyền thám hiểm ngân hà", category: "Vũ trụ", icon: "🚀" },
  { word: "HERO", clue: "Người hùng nhí dũng cảm", category: "Nhân vật", icon: "🦸" },
  { word: "LION", clue: "Chúa sơn lâm dũng mãnh", category: "Động vật", icon: "🦁" },
  { word: "BEAR", clue: "Chú gấu thích mật ong", category: "Động vật", icon: "🐻" },
  { word: "CODE", clue: "Mật mã bí mật", category: "Khoa học", icon: "💻" },
  { word: "GAME", clue: "Trò chơi siêu thú vị", category: "Giải trí", icon: "🎮" },
  { word: "BIRD", clue: "Chú chim hót líu lo", category: "Động vật", icon: "🐦" },

  // Cấp độ 3: 5 chữ cái
  { word: "ROBOT", clue: "Người bạn máy Beep-Bot", category: "Công nghệ", icon: "🤖" },
  { word: "SPACE", clue: "Không gian vũ trụ bao la", category: "Vũ trụ", icon: "🌌" },
  { word: "MAGIC", clue: "Phép thuật kỳ diệu", category: "Huyền bí", icon: "✨" },
  { word: "EARTH", clue: "Trái Đất hành tinh xanh", category: "Vũ trụ", icon: "🌍" },
  { word: "BRAVE", clue: "Dũng cảm vượt qua thử thách", category: "Phẩm chất", icon: "🛡️" },
  { word: "WATER", clue: "Nguồn nước trong lành", category: "Thiên nhiên", icon: "💧" }
];

/* ==========================================================================
   12 BADGES / ACHIEVEMENTS
   ========================================================================== */
const BADGES_DEF = [
  { id: "cadet", icon: "🚀", title: "Tân Binh Vũ Trụ", desc: "Hoàn thành màn học đầu tiên (Level 1)." },
  { id: "streak_5", icon: "🔥", title: "Bàn Tay Nhanh Nhẹn", desc: "Đạt chuỗi 5 câu đúng liên tiếp." },
  { id: "streak_15", icon: "⚡", title: "Tia Chớp Morse", desc: "Đạt chuỗi 15 câu đúng liên tiếp." },
  { id: "boss_slayer", icon: "👑", title: "Vượt Ải Boss", desc: "Chiến thắng một màn Thử Thách Boss." },
  { id: "word_hunter", icon: "🕵️", title: "Thám Tử Mật Mã", desc: "Giải mã thành công 3 từ bí mật." },
  { id: "broadcaster", icon: "📡", title: "Trạm Phát Sóng", desc: "Phát sóng 1 thông điệp bí mật." },
  { id: "keyer_master", icon: "🎹", title: "Nghệ Sĩ Điện Báo", desc: "Phát đúng 5 chữ cái ở chế độ Luyện Gõ." },
  { id: "halfway", icon: "🪐", title: "Thám Hiểm Nửa Ngân Hà", desc: "Mở khóa thành công Level 7." },
  { id: "all_letters", icon: "🏆", title: "Đại Sứ Morse Toàn Năng", desc: "Mở khóa toàn bộ 13 Level bảng chữ cái." },
  { id: "star_collector", icon: "⭐", title: "Bầu Trời Ngôi Sao", desc: "Thu thập đủ 15 ngôi sao vàng." },
  { id: "sound_explorer", icon: "🎵", title: "Đôi Tai Âm Nhạc", desc: "Thử qua cả 4 bộ âm thanh khác nhau." },
  { id: "perfect_run", icon: "💎", title: "Tuyệt Đối Hoàn Hảo", desc: "Vượt qua một bài học với độ chính xác 100%." }
];
