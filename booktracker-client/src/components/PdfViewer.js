import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function PdfViewer() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const BASE_URL = "http://localhost:7500";

  const getBook = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/getBook/${id}`);
      setBook(res.data.book);
    } catch (err) {
      console.log("PDF ERROR:", err);
    }
  };

  useEffect(() => {
    getBook();
  }, []); // تم تجاهل التحذير ولا يؤثر على الأداء

  if (!book) return <h3 className="text-center mt-5">Loading...</h3>;

  if (!book.pdfUrl)
    return <h3 className="text-center mt-5 text-danger">No PDF available</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{book.title}</h2>
      <h4 className="text-muted">{book.author}</h4>

      <iframe
        title="pdf-viewer"
        src={book.pdfUrl}
        width="100%"
        height="600px"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
}
