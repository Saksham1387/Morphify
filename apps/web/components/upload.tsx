export const Upload = () =>{
    return (
        <div className="flex-grow">
                  <FileUpload
                    multiple={true}
                    onChange={(files) => handleFileChange(files)}
                  />
                </div>
    )
}