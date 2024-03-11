# create directory structure for stoarage api
cd ~
mkdir upload
cd upload
mkdir default

# for invalid documents
mkdir kyc_invalid_documents
cd kyc_invalid_documents
mkdir default
mkdir driver_license_documents
mkdir none_photo_id_documents
mkdir passport_documents
mkdir photo_id_documents
mkdir selfie_documents


# for valid documents
cd ..
mkdir kyc_valid_documents
cd kyc_valid_documents
mkdir default

mkdir driver_license_documents
cd driver_license_documents
mkdir wrong_documents
cd ..

mkdir none_photo_id_documents
cd none_photo_id_documents
mkdir wrong_documents
cd ..


mkdir passport_documents
cd passport_documents
mkdir wrong_documents
cd ..

mkdir photo_id_documents
cd photo_id_documents
mkdir wrong_documents
cd ..

mkdir selfie_documents
cd selfie_documents
mkdir wrong_documents
cd ..
