# ImageUploadAPI

Simple image upload api used for [ShareX](https://getsharex.com/)

## Endpoints

| Method | endpoint          | Info                                               |
|--------|-------------------|----------------------------------------------------|
| GET    | /:file            | :file - The image wanted, can be without extension |
| POST   | /api/upload       | upload a new image, name is auto generated.        |
| POST   | /api/delete/:file | deletes :file if it exists                         |
