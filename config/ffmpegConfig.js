module.exports = [
  '-maxrate',
  '2000k', // Максимальный битрейт видео
  '-bufsize',
  '4000k', // Размер буфера
  '-c:v',
  'libx264', // Видеокодек
  '-c:a',
  'aac', // Аудиокодек
  '-b:v',
  '1500k', // Битрейт видео (низкое качество)
  '-b:a',
  '96k', // Битрейт аудио (низкое качество)
  '-s',
  '1280x720', // Разрешение 720p
  '-pix_fmt',
  'yuv420p', // Формат пикселей
  '-f',
  'flv', // Формат вывода
  '-preset',
  'ultrafast', // Самая быстрая настройка кодирования
  '-tune',
  'zerolatency', // Минимизация задержек
]
// module.exports = [
//   '-maxrate 8000k',
//   '-bufsize',
//   '16000k',
//   '-c:v',
//   'libx264', // Видеокодек
//   '-c:a',
//   'aac', // Аудиокодек
//   '-b:v',
//   '8000k', // Битрейт видео
//   '-b:a',
//   '128k', // Битрейт аудио
//   '-s',
//   '1920x1080', // Разрешение
//   '-pix_fmt',
//   'yuv420p', // Формат пикселей
//   '-f',
//   'flv', // Формат вывода
//   '-preset',
//   'veryfast', // Настройка скорости кодирования
//   '-tune',
//   'zerolatency', // Минимизация задержек
// ]

/*
-maxrate 8000k: Устанавливает максимальную скорость передачи данных видео на 8000 килобит в секунду.
-bufsize 12000k: Устанавливает размер буфера для управления скоростью передачи данных на 12000 килобит.
-f flv: Устанавливает формат выходного файла как FLV (Flash Video).
-c:v libx264: Устанавливает кодек видео как libx264 (H.264).
-preset veryfast: Устанавливает предустановку скорости кодирования как "veryfast" (очень быстро).
-tune zerolatency: Настраивает кодек для минимальной задержки.
-c:a aac: Устанавливает кодек аудио как AAC.
-ar 44100: Устанавливает частоту дискретизации аудио на 44100 Гц.
-b:a 128k: Устанавливает битрейт аудио на 128 килобит в секунду.
-ac 2: Устанавливает количество аудиоканалов на 2 (стерео).
-profile:v baseline: Устанавливает профиль H.264 как baseline (основной).
-pix_fmt yuv420p: Устанавливает формат пикселей как YUV 4:2:0.
-threads 0: Устанавливает количество потоков для кодирования на автоматическое определение.
-preset ultrafast: Устанавливает предустановку скорости кодирования как "ultrafast" (ультрабыстро).
Дополнительные параметры для ffmpeg
Вот некоторые другие параметры, которые можно использовать с ffmpeg:

-r 30: Устанавливает частоту кадров на 30 кадров в секунду.
-g 60: Устанавливает интервал между ключевыми кадрами на 60 кадров.
-vf "scale=1280:720": Устанавливает разрешение видео на 1280x720.
-crf 23: Устанавливает коэффициент качества для кодека H.264 (меньшее значение означает лучшее качество).
-movflags +faststart: Перемещает метаданные в начало файла для быстрого старта воспроизведения.
-strict experimental: Разрешает использование экспериментальных функций.
-b:v 2500k: Устанавливает битрейт видео на 2500 килобит в секунду.
-max_muxing_queue_size 1024: Устанавливает максимальный размер очереди мультиплексирования.
Эти параметры можно комбинировать и настраивать в зависимости от ваших требований к качеству и производительности.*/
