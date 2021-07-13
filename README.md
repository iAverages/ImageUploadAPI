# ImageUploadAPI

Simple image upload api used for [ShareX](https://getsharex.com/)

## Endpoints

| Method | endpoint    | Info                                               |
| ------ | ----------- | -------------------------------------------------- |
| GET    | /:file      | :file - The image wanted, can be without extension |
| POST   | /api/upload | upload a new image, name is auto generated.        |

When uploading an image, the form data name for the file must be `file`.
The succcessful upload json response will contain the url at `data.url`

## Example ShareX config

```json
{
    "Version": "1.0.0",
    "Name": "Image uploader",
    "DestinationType": "ImageUploader, FileUploader",
    "RequestMethod": "POST",
    "RequestURL": "http://localhost:3000/api/upload",
    "Headers": {
        "Key": "Your key as defined in the .env file."
    },
    "Body": "MultipartFormData",
    "FileFormName": "file",
    "URL": "$json:data.url$"
}
```
