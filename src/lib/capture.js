// Canvas-based capture utility for generating 1080x1920 PNG for Instagram Stories
export const captureShareImage = async (videoElement, options = {}) => {
  const {
    width = 1080,
    height = 1920,
    backgroundColor = '#ffffff',
    color = '#4285F4',
    suitSymbol = '♠',
    suitColor = '#000000',
    question = '',
    quality = 0.9
  } = options;

  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Draw header
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 48px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('GDG Noida', width / 2, 80);

    ctx.fillStyle = '#666666';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillText('Riddle Cards', width / 2, 150);

    // Draw camera area (circle)
    const cameraY = 350;
    const cameraRadius = 200;
    const borderWidth = 12;
    
    ctx.save();
    
    // Clip to circle for video/placeholder first
    ctx.beginPath();
    ctx.arc(width / 2, cameraY, cameraRadius - borderWidth, 0, 2 * Math.PI);
    ctx.clip();
    
    // Draw video or placeholder
    if (videoElement && videoElement.videoWidth > 0 && videoElement.readyState >= 2) {
      console.log('Drawing video to canvas:', {
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        readyState: videoElement.readyState
      });
      
      const videoAspect = videoElement.videoWidth / videoElement.videoHeight;
      const circleSize = (cameraRadius - borderWidth) * 2;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (videoAspect > 1) {
        // Video is wider
        drawHeight = circleSize;
        drawWidth = drawHeight * videoAspect;
        drawX = width / 2 - drawWidth / 2;
        drawY = cameraY - drawHeight / 2;
      } else {
        // Video is taller
        drawWidth = circleSize;
        drawHeight = drawWidth / videoAspect;
        drawX = width / 2 - drawWidth / 2;
        drawY = cameraY - drawHeight / 2;
      }
      
      ctx.drawImage(videoElement, drawX, drawY, drawWidth, drawHeight);
    } else {
      console.log('Drawing placeholder - video not ready:', {
        hasVideo: !!videoElement,
        videoWidth: videoElement?.videoWidth,
        readyState: videoElement?.readyState
      });
      // Draw placeholder
      ctx.fillStyle = '#e5e7eb';
      ctx.fillRect(
        width / 2 - (cameraRadius - borderWidth),
        cameraY - (cameraRadius - borderWidth),
        (cameraRadius - borderWidth) * 2,
        (cameraRadius - borderWidth) * 2
      );
      
      // Draw person icon (simplified)
      ctx.fillStyle = '#9ca3af';
      ctx.beginPath();
      ctx.arc(width / 2, cameraY - 30, 40, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.beginPath();
      ctx.ellipse(width / 2, cameraY + 60, 70, 50, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    ctx.restore();
    
    // Now draw the colored border ring
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.arc(width / 2, cameraY, cameraRadius - borderWidth / 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw larger, more visible suit icon overlay with colored background
    const suitX = width / 2 + cameraRadius - 70;
    const suitY = cameraY + cameraRadius - 70;
    const suitIconRadius = 45;
    
    // Add shadow
    ctx.shadowColor = 'rgba(0,0,0,0.25)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 6;
    
    // Draw colored circle background for suit icon
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(suitX, suitY, suitIconRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw white inner circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(suitX, suitY, suitIconRadius - 6, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw suit symbol larger and bolder
    ctx.fillStyle = suitColor;
    ctx.font = 'bold 42px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(suitSymbol, suitX, suitY);

    // Draw riddle content
    const riddleY = 700;
    const riddleMaxWidth = 800;
    const riddlePadding = 40;
    const riddleBoxX = width / 2 - riddleMaxWidth / 2;
    const riddleBoxHeight = 200;
    const riddleRadius = 20;
    
    // Add more vibrant gradient background for riddle
    const gradient = ctx.createLinearGradient(
      riddleBoxX,
      riddleY,
      riddleBoxX + riddleMaxWidth,
      riddleY + riddleBoxHeight
    );
    gradient.addColorStop(0, color + '45');
    gradient.addColorStop(1, color + '20');
    
    // Draw single rounded rect with fill and stroke
    ctx.fillStyle = gradient;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(riddleBoxX + riddleRadius, riddleY);
    ctx.lineTo(riddleBoxX + riddleMaxWidth - riddleRadius, riddleY);
    ctx.quadraticCurveTo(riddleBoxX + riddleMaxWidth, riddleY, riddleBoxX + riddleMaxWidth, riddleY + riddleRadius);
    ctx.lineTo(riddleBoxX + riddleMaxWidth, riddleY + riddleBoxHeight - riddleRadius);
    ctx.quadraticCurveTo(riddleBoxX + riddleMaxWidth, riddleY + riddleBoxHeight, riddleBoxX + riddleMaxWidth - riddleRadius, riddleY + riddleBoxHeight);
    ctx.lineTo(riddleBoxX + riddleRadius, riddleY + riddleBoxHeight);
    ctx.quadraticCurveTo(riddleBoxX, riddleY + riddleBoxHeight, riddleBoxX, riddleY + riddleBoxHeight - riddleRadius);
    ctx.lineTo(riddleBoxX, riddleY + riddleRadius);
    ctx.quadraticCurveTo(riddleBoxX, riddleY, riddleBoxX + riddleRadius, riddleY);
    ctx.closePath();
    
    ctx.fill();
    ctx.stroke();
    
    // Draw question text with wrapping
    ctx.fillStyle = '#333333';
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    wrapText(
      ctx,
      question,
      width / 2,
      riddleY + riddlePadding,
      riddleMaxWidth - riddlePadding * 2,
      35
    );
    
    // Draw footer text
    ctx.fillStyle = '#888888';
    ctx.font = '18px Inter, system-ui, sans-serif';
    ctx.fillText('Share your riddle moment with GDG Noida!', width / 2, 950);

    // Convert to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', quality);
    });

  } catch (error) {
    console.error('Error capturing image:', error);
    throw error;
  }
};

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Helper function to wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

// Download the captured image
export const downloadImage = (blob, filename = 'gdg-riddle-card.png') => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// Share using Web Share API if available
export const shareImage = async (blob, filename = 'gdg-riddle-card.png') => {
  if (navigator.share && navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'GDG Noida Riddle Card',
          text: 'Check out this riddle from GDG Noida!',
          files: [file]
        });
        return true;
      }
    } catch (error) {
      console.log('Web Share API failed:', error);
    }
  }
  
  // Fallback to download
  downloadImage(blob, filename);
  return false;
};
