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

  console.log('captureShareImage called with:', {
    hasVideo: !!videoElement,
    videoWidth: videoElement?.videoWidth,
    videoHeight: videoElement?.videoHeight,
    readyState: videoElement?.readyState,
    color,
    suitSymbol,
    question: question.substring(0, 30) + '...'
  });

  try {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    console.log('Canvas created:', width, 'x', height);

    // Fill background with gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, backgroundColor);
    bgGradient.addColorStop(1, '#f8fafc');
    ctx.fillStyle = bgGradient;
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

    // Draw camera area (circle) - moved down for better balance
    const cameraY = 600;
    const cameraRadius = 350;
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

    // Draw riddle content - pushed further down
    const riddleY = 1100;
    const riddleMaxWidth = 800;
    const riddlePadding = 40;
    const riddleBoxX = width / 2 - riddleMaxWidth / 2;
    const riddleBoxHeight = 400;
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
    
    // Draw question text with wrapping - centered vertically in the box
    ctx.fillStyle = '#333333';
    ctx.font = '50px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Calculate text height to center it vertically in the box
    const textLines = wrapTextAndGetLines(ctx, question, riddleMaxWidth - riddlePadding * 2, 60);
    const textHeight = textLines.length * 60; // line height is 60
    const boxCenterY = riddleY + riddleBoxHeight / 2;
    const textStartY = boxCenterY - textHeight / 2;
    
    // Draw each line of text
    textLines.forEach((line, index) => {
      ctx.fillText(line, width / 2, textStartY + (index * 60));
    });
    
    // Draw footer text - moved to bottom for better balance
    ctx.fillStyle = '#888888';
    ctx.font = '24px Inter, system-ui, sans-serif';
    ctx.fillText('Share your riddle moment with GDG Noida!', width / 2, height - 100);

    // Convert to blob with timeout
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Blob creation timed out after 10 seconds'));
      }, 10000);
      
      canvas.toBlob((blob) => {
        clearTimeout(timeout);
        if (blob) {
          console.log('Blob created successfully:', blob.size, 'bytes');
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob returned null'));
        }
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

// Helper function to wrap text and return lines as array (for centering)
function wrapTextAndGetLines(ctx, text, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

// Download the captured image
export const downloadImage = (blob, filename = 'gdg-riddle-card.png') => {
  console.log('downloadImage called with blob:', blob?.size, 'bytes');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  console.log('Download triggered for:', filename);
  link.remove();
  URL.revokeObjectURL(url);
};

// Share using Web Share API if available
export const shareImage = async (blob, filename = 'gdg-riddle-card.png') => {
  console.log('shareImage called with blob:', blob?.size, 'bytes');
  
  if (navigator.share && navigator.canShare) {
    console.log('Web Share API available, attempting to share...');
    try {
      const file = new File([blob], filename, { type: 'image/png' });
      
      if (navigator.canShare({ files: [file] })) {
        console.log('Can share files, sharing...');
        await navigator.share({
          title: 'GDG Noida Riddle Card',
          text: 'Check out this riddle from GDG Noida!',
          files: [file]
        });
        console.log('Share completed successfully');
        return true;
      } else {
        console.log('Cannot share files, falling back to download');
      }
    } catch (error) {
      console.log('Web Share API failed:', error);
    }
  } else {
    console.log('Web Share API not available, using download');
  }
  
  // Fallback to download
  downloadImage(blob, filename);
  return false;
};
