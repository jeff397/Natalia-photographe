import React from "react";
import { useParams } from "react-router-dom";
import GalleryManager from "../components/GalleryManager/GalleryManager";

const PrivateGalleryAdminDetail = () => {
  const { galleryId } = useParams();

  return (
    <section style={{ padding: "4rem" }}>
      <h1>Gérer la galerie</h1>
      <GalleryManager galleryId={galleryId} />
    </section>
  );
};

export default PrivateGalleryAdminDetail;
