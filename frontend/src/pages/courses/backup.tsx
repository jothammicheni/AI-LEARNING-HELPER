
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import PDF from 'react-pdf-js';
// import { FaHeadphones, FaBook, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
// import { MdMenuBook } from 'react-icons/md';

// interface Chapter {
//   id: number;
//   title: string;
//   contentPath: string;
//   isCompleted: boolean;
// }

// export default function CoursePage() {
//   const { courseId } = useParams();
//   const [chapters, setChapters] = useState<Chapter[]>([]);
//   const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
//   const [isAudioMode, setIsAudioMode] = useState(false);
//   const [audioUrl, setAudioUrl] = useState('');
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState<number | null>(null);
//   const [pdfLoading, setPdfLoading] = useState(true);
//   const [pdfError, setPdfError] = useState<string | null>(null);

//   useEffect(() => {
//     if (courseId) {
//       fetchChapters();
//     }
//   }, [courseId]);

//   const fetchChapters = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5007/api/chapter/getChapters/${courseId}`);
//       setChapters(response.data.chapters);
//       if (response.data.chapters.length > 0) {
//         setSelectedChapter(response.data.chapters[0]);
//       }
//     } catch (error) {
//       console.error('Error fetching chapters:', error);
//     }
//   };

//   const handleChapterClick = (chapter: Chapter) => {
//     setSelectedChapter(chapter);
//     setIsAudioMode(false);
//     setAudioUrl('');
//     setPage(1);
//     setPdfLoading(true);
//     setPdfError(null);
//   };

//   const toggleAudioMode = async () => {
//     if (isAudioMode) {
//       setIsAudioMode(false);
//       setAudioUrl('');
//     } else if (selectedChapter) {
//       try {
//         const response = await axios.post(`http://localhost:5007/api/chapter/speak/${selectedChapter.id}`);
//         setAudioUrl(response.data.audioUrl);
//         setIsAudioMode(true);
//       } catch (error) {
//         console.error('Error fetching audio:', error);
//       }
//     }
//   };

//   const onDocumentComplete = (pages: number) => {
//     setPages(pages);
//     setPdfLoading(false);
//   };

//   const onPageComplete = (page: number) => {
//     setPage(page);
//   };

//   const handlePrevious = () => {
//     setPage((prevPage) => Math.max(prevPage - 1, 1));
//   };

//   const handleNext = () => {
//     setPage((prevPage) => Math.min(prevPage + 1, pages || prevPage));
//   };

//   const renderPagination = () => {
//     if (!pages) return null;

//     return (
//       <nav>
//         <ul className="pager flex justify-between mt-4">
//           <li className={`previous ${page === 1 ? 'disabled' : ''}`}>
//             <button onClick={handlePrevious} disabled={page === 1} className="flex items-center text-teal-700">
//               <FaArrowLeft className="mr-2 " /> Previous
//             </button>
//           </li>
//           <li className={`next ${page === pages ? 'disabled' : ''}`}>
//             <button onClick={handleNext} disabled={page === pages} className="flex items-center text-teal-700">
//               Next <FaArrowRight className="ml-2" />
//             </button>
//           </li>
//         </ul>
//       </nav>
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-teal-50 shadow-md overflow-y-auto fixed h-full">
//         <div className="p-4">
//           <h2 className="text-xl font-semibold mb-4 flex items-center text-teal-700">
//             <MdMenuBook className="mr-2" />
//             Chapters
//           </h2>
//           <ul>
//             {chapters.map((chapter) => (
//               <li
//                 key={chapter.id}
//                 className={`mb-2 p-2 rounded cursor-pointer ${
//                   selectedChapter?.id === chapter.id ? 'bg-blue-100' : 'hover:bg-gray-100'
//                 }`}
//                 onClick={() => handleChapterClick(chapter)}
//               >
//                 {chapter.title}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 flex-1 p-8">
//         {selectedChapter && (
//           <div>
//             <h1 className="text-3xl font-bold mb-4 text-teal-700">{selectedChapter.title}</h1>
//             <button
//               onClick={toggleAudioMode}
//               className={`mb-4 px-4 py-2 rounded ${
//                 isAudioMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
//               } flex items-center`}
//             >
//               {isAudioMode ? <FaHeadphones className="mr-2" /> : <FaBook className="mr-2" />}
//               {isAudioMode ? 'Switch to Text' : 'Switch to Audio'}
//             </button>

//             {isAudioMode ? (
//               audioUrl && <audio src={audioUrl} controls className="w-full" />
//             ) : (
//               <div className="border rounded shadow-lg p-4 bg-white">
//                 {pdfLoading && <p>Loading PDF...</p>}
//                 {pdfError && <p className="text-red-500">Error loading PDF: {pdfError}</p>}
//                 {selectedChapter && selectedChapter.contentPath && (
//                   <PDF
//                     file={`http://localhost:5007${selectedChapter.contentPath}`}
//                     onDocumentComplete={onDocumentComplete}
//                     onPageComplete={onPageComplete}
//                     page={page}
//                     scale={1.5}
//                     onError={(error: Error) => {
//                       console.error('Error loading PDF:', error);
//                       setPdfError(error.message);
//                       setPdfLoading(false);
//                     }}
//                   />
//                 )}
//                 {renderPagination()}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }