import {Box, Button, TextField, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
  placeholder?: string;
}

// eslint-disable-next-line react/function-component-definition
const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<any>(null);
  const CKEditorRef = useRef<any>(null);
  const ClassicEditorRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let isMounted = true;

    const loadCKEditor = async () => {
      try {
        console.log("Loading CKEditor...");

        // Dynamic imports
        const [ckeditorReact, classicEditor] = await Promise.all([
          import("@ckeditor/ckeditor5-react"),
          import("@ckeditor/ckeditor5-build-classic"),
        ]);

        if (!isMounted) return;

        CKEditorRef.current = ckeditorReact.CKEditor;
        ClassicEditorRef.current = classicEditor.default;

        console.log("CKEditor loaded successfully");
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Failed to load CKEditor:", err);
        if (isMounted) {
          setError("Không thể tải trình soạn thảo");
        }
      }
    };

    loadCKEditor();

    // eslint-disable-next-line consistent-return
    return () => {
      isMounted = false;
    };
  }, [isClient]);

  const handleRetry = () => {
    setError(null);
    setIsLoaded(false);

    const retryLoad = async () => {
      try {
        const [ckeditorReact, classicEditor] = await Promise.all([
          import("@ckeditor/ckeditor5-react"),
          import("@ckeditor/ckeditor5-build-classic"),
        ]);

        CKEditorRef.current = ckeditorReact.CKEditor;
        ClassicEditorRef.current = classicEditor.default;
        setIsLoaded(true);
        setError(null);
      } catch (err) {
        console.error("Retry failed:", err);
        setError("Vẫn không thể tải trình soạn thảo");
      }
    };

    retryLoad();
  };

  if (!isClient) {
    return (
      <Box className="border border-gray-300 rounded p-4 text-center">
        <Typography>Đang khởi tạo...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="border border-red-300 rounded p-4 bg-red-50">
        <Typography color="error" className="mb-2">
          {error}
        </Typography>
        <Box className="flex gap-2 justify-center mb-4">
          <Button variant="outlined" size="small" onClick={handleRetry}>
            Thử lại
          </Button>
          <Button
            variant="text"
            size="small"
            onClick={() => window.location.reload()}
          >
            Tải lại trang
          </Button>
        </Box>
        <Box>
          <Typography variant="caption" className="mb-2 block text-gray-600">
            Sử dụng trình soạn thảo đơn giản:
          </Typography>
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
            multiline
            rows={8}
            fullWidth
            placeholder={placeholder}
            variant="outlined"
          />
        </Box>
      </Box>
    );
  }

  if (!isLoaded || !CKEditorRef.current || !ClassicEditorRef.current) {
    return (
      <Box className="border border-gray-300 rounded p-4 text-center">
        <Typography>Đang tải trình soạn thảo...</Typography>
        <Typography variant="caption" className="mt-2 block text-gray-500">
          Vui lòng đợi...
        </Typography>
      </Box>
    );
  }

  const CKEditor = CKEditorRef.current;
  const ClassicEditor = ClassicEditorRef.current;

  return (
    <Box className="border border-gray-300 rounded">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "|",
            "outdent",
            "indent",
            "|",
            "blockQuote",
            "undo",
            "redo",
          ],
          placeholder: placeholder,
        }}
        onReady={(editor: any) => {
          console.log("Editor is ready!", editor);
          editorRef.current = editor;
        }}
        onChange={(event: any, editor: any) => {
          try {
            const data = editor.getData();
            onChange(data);
          } catch (err) {
            console.error("Error getting editor data:", err);
          }
        }}
        onError={(error: any, {willEditorRestart}: any) => {
          console.error("CKEditor error:", error);
          if (!willEditorRestart) {
            setError("Có lỗi xảy ra với trình soạn thảo");
          }
        }}
      />
    </Box>
  );
};

export default CKEditorWrapper;
