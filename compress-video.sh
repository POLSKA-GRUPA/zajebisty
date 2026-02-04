#!/bin/bash

# Script para comprimir el video grande
# Requiere ffmpeg instalado: brew install ffmpeg

echo "Comprimiendo marketingzjajami.mp4..."

# Backup del archivo original
cp public/marketingzjajami.mp4 public/marketingzjajami.mp4.backup

# Comprimir el video manteniendo calidad razonable
ffmpeg -i public/marketingzjajami.mp4.backup \
  -c:v libx264 \
  -preset medium \
  -crf 28 \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  public/marketingzjajami.mp4 \
  -y

echo "Video comprimido exitosamente"
echo "Archivo original guardado como marketingzjajami.mp4.backup"