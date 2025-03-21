import { Response, Request } from "express";
import prisma from "../config/database";
import path from "path";
import fs from 'fs';
import pdfParse from 'pdf-parse';
import gtts from 'node-gtts';
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
 
const addCourseChapter = async (req: Request, res: Response) => {
    try {
        const { courseId, title } = req.body;

        if (!req.file) {
            res.status(400).send("Cover image is required");
            return
        }

        if (!courseId) {
            res.status(400).send('Course ID is required');
            return
        }

        const parsedCourseId = parseInt(courseId, 10);
        if (isNaN(parsedCourseId)) {
            res.status(400).send('Invalid Course ID');
            return
        }

        console.log(typeof parsedCourseId)

        const titleExists = await prisma.chapters.findFirst({
            where: {
                title: title,
                courseId: parsedCourseId
            }
        });
        if (titleExists) {
            res.status(409).send('Chapter with the same name exists in this course');
            return
        }
        const courseExists = await prisma.courses.findFirst({
            where: {
                id: parsedCourseId
            }
        });
        if (!courseExists) {
            res.status(404).send('The course ID does not match any course');
            return
        }


        const contentPath = path.join('/chapterFiles', courseExists.title.replace(/\s+/g, "_"), req.file.filename);

        const newChapter = await prisma.chapters.create({
            data: {
                courseId: parsedCourseId,
                title,
                contentPath
            },
        });

        res.status(201).json({
            message: "Chapter added successfully",
            chapter: newChapter,
        });
        return

    } catch (error) {
        console.error("Error adding chapter:", error);
        if (error instanceof PrismaClientValidationError) {
            res.status(400).json({ message: "Validation error", details: error.message });
            return
        }
        res.status(500).json({ message: "An unexpected error occurred" });
        return
    }
};


const downloadChapterFile = async (req: Request, res: Response) => {
    const { chapterId } = req.params;

    if (!chapterId) {
        res.status(400).send('Chapter ID is required');
        return
    }

    const parsedChapterId = parseInt(chapterId, 10);
    if (isNaN(parsedChapterId)) {
        res.status(400).send('Invalid Chapter ID');
        return
    }

    try {
        const chapter = await prisma.chapters.findFirst({
            where: { id: parsedChapterId },
        });

        if (!chapter) {
            res.status(404).send('Chapter not found');
            return
        }

        const filePath = path.join(__dirname, '../views', chapter.contentPath);
        console.log('Full file path:', filePath);
        console.log('Current working directory:', process.cwd());

        if (!fs.existsSync(filePath)) {
            console.error('File not found:', filePath);
            res.status(404).send('File not found');
            return
        }

        res.download(filePath, (downloadErr) => {
            if (downloadErr) {
                console.error('Error downloading the file:', downloadErr);
                res.status(500).send('Error downloading the file');
                return
            }
            res.json({ message: 'file downloaded' })
        });
    } catch (error) {
        console.error('Error fetching chapter:', error);
        res.status(500).send('An error occurred while fetching the chapter');
        return
    }
};

//change files to audio
const changeFilesToAudio = async (req: Request, res: Response) => {
    try {
        const { chapterId } = req.params;

        if (!chapterId) {
            res.status(400).send('Chapter ID is required');
            return;
        }

        const parsedChapterId = parseInt(chapterId, 10);
        if (isNaN(parsedChapterId)) {
            res.status(400).send('Invalid Chapter ID');
            return;
        }

        const chapter = await prisma.chapters.findFirst({
            where: { id: parsedChapterId },
        });

        if (!chapter) {
            res.status(404).send('Chapter not found');
            return;
        }

        const filePath = path.join(__dirname, '../views', chapter.contentPath);
        if (!fs.existsSync(filePath)) {
            res.status(404).send('PDF file not found');
            return
        }

        const pdfData = await pdfParse(fs.readFileSync(filePath));
        const pdfText = pdfData.text;

        const tts = gtts('en');

        const audioDir = path.join(__dirname, 'audio');

        // Check if the directory exists; if not, create it
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        const audioPath = path.join(audioDir, `${chapter.title.replace(/\s+/g, '_')}.mp3`);

        tts.save(audioPath, pdfText, (err: Error | null) => {
            if (err) {
                console.error('Error saving audio:', err);
                res.status(500).send('Failed to create audio');
                return
            }

            // Send the URL of the audio file back to the client
            const audioUrl = `/audio/${path.basename(audioPath)}`;
            res.status(200).json({ audioUrl });
        });
    } catch (error) {
        console.error('Error converting PDF to audio:', error);
        res.status(500).send('An error occurred while processing your request');
    }
};
const isComplete = async (req: Request, res: Response) => {
    const { chapterId } = req.params;

    try {
       
        const chapter = await prisma.chapters.findUnique({
            where: { id: Number(chapterId) }
        });

        if (!chapter) {
            res.status(404).json({ message: 'Chapter not found' });
            return;
        }

        const status = chapter.isCompleted ? true : false;
        
        res.status(200).json({ status });
    } catch (error) {
        console.error("Error checking chapter completion:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export { addCourseChapter, downloadChapterFile, changeFilesToAudio,isComplete  }