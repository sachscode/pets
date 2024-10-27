from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Serve static files (HTML, CSS, JS)
app.mount("/static", StaticFiles(directory=".", html=True), name="static")


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file content to a directory if needed
        content = await file.read()  # Read file content
        filename = file.filename
        file_size = len(content)
        content_type = file.content_type

        # Example: Return file information as JSON
        return JSONResponse({
            "filename": filename,
            "size": file_size,
            "content_type": content_type
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

# Add an error handler for 405 Method Not Allowed
@app.exception_handler(405)
async def method_not_allowed_handler(request, exc):
    return JSONResponse(
        status_code=405,
        content={"message": "Method Not Allowed"}
    )
    
@app.get("/")
async def read_index():
    return FileResponse("index.html")