const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 입력, 출력 기본 경로 설정
const INPUT_DIR = path.join(__dirname, '../app/fnb/total_images');
const OUTPUT_DIR = path.join(__dirname, '../public/fnb/images/compressed');

// 허용할 확장자 및 무시할 폴더
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const IGNORE_DIRS = ['Pretendard-1.3.9', 'logo_image'];

async function processDirectory(currentDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(currentDir);
    for (const file of files) {
        const fullPath = path.join(currentDir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (IGNORE_DIRS.includes(file)) continue;
            await processDirectory(fullPath, path.join(targetDir, file));
        } else if (ALLOWED_EXTS.includes(path.extname(file).toLowerCase())) {
            // 파일명 처리 (공백이나 한글 등 안전하게 처리하지만 원본 구조 유지)
            // 확장자를 webp로 교체
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            // 영문자로 치환하지 않고 그대로 유지해도 웹 접근시 인코딩 가능, 하지만 안전한 영문화 필요시엔 여기서 할수 있음. 우리는 구조 유지를 위해 그대로 씁니다.
            const newFileName = baseName + '.webp';
            const outputPath = path.join(targetDir, newFileName);
            
            try {
                // 이미지 리사이징(가로폭 최대 1920px 기준 유지, 더 작으면 그대로, 비율 유지) 및 webp 압축
                await sharp(fullPath)
                    .resize({ width: 1920, withoutEnlargement: true })
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`[압축 성공] ${newFileName}`);
            } catch(e) {
                console.error(`[압축 실패] ${file}: ${e.message}`);
            }
        }
    }
}

async function main() {
    console.log("=== 이미지 압축 최적화 스크립트 시작 ===");
    await processDirectory(INPUT_DIR, OUTPUT_DIR);
    console.log("=== 완료 ===");
}

main();
