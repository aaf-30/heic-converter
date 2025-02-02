const convert = require("heic-convert");
const mime = require("mime");
const readline = require('readline');
const { join, resolve } = require("path");
const { readFile, writeFile, readdir, mkdir, access } = require("fs/promises");

(async () => {
    console.info(`\x1b[33mMemindai folder...\x1b[0m`);
    const files = (await readdir("./")).filter(x => /heic$/i.test(mime.getType(x)));
    if (files.length > 0) {
        console.info(`\x1b[33m${files.length} file HEIC ditemukan\x1b[0m`);
        const lanjut = await input('Apakah Anda ingin melanjutkan proses konversi (y/n)?');
        if (/^n$/i.test(lanjut)) {
            console.info("Baiklah, terima kasih...");
            await delay(3000);
            process.exit(0);
        }
        try {
            await access(join("./", "output"));
        } catch (error) {
            console.info("Membuat folder \x1b[32moutput\x1b[0m");
            await mkdir(join("./", "output"));
        }
        process.stdout.write(`\x1b[32mMemulai proses konversi....\x1b[0m`);
        await delay(3000);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        let count = 1;
        for (const x of files) {
            process.stdout.write(`\x1b[34mMengkonversi ${count} dari ${files.length} gambar\x1b[0m\n\x1b[33m(Tekan CTRL+C untuk menghentikan)\x1b[0m`);
            const inputBuffer = await readFile(join("./", x));
            const outputBuffer = await convert({
                buffer: inputBuffer,
                format: 'JPEG',
                quality: 1
            });
            await writeFile(join("./", "output", x.replace(/heic$/i, "jpeg")), outputBuffer);
            count++
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
        }
        console.info("Selesai mengkonversi", files.length, "gambar");
    } else {
        console.info("\x1b[31mTidak ditemukan file HEIC di folder ini\x1b[0m");
    }
    await input("Tekan \x1b[32menter\x1b[0m untuk keluar")
})();

async function input(text) {
    return await new Promise(res => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(text, (answer) => {
            rl.close();
            res(answer);
        });
    })
}

async function delay(timeout) {
    return await new Promise(res => setTimeout(res, timeout));
}