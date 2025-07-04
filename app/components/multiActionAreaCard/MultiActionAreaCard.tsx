"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import { FaRegHeart, FaHeart, FaShare } from "react-icons/fa";
import { MultiActionAreaCardProps } from "@/app/types/interfaces"; //

import { useSelector, useDispatch } from "react-redux";
import type { AppState, AppDispatch } from "@/app/store/store"; //
import { toggleLike } from "./LikeSlice"; //
import { Link } from "@/i18n/navigation"; //

export default function MultiActionAreaCard({
  id,
  image,
  alt,
  title,
  description,
  detailLink,
}: MultiActionAreaCardProps) {
  const isLike = useSelector((state: AppState) => state.like.likes[id]);
  const dispatch: AppDispatch = useDispatch();

  const handleLikeClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleLike(id));
  };

  const handleShareClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log("Compartilhar pet:", id);
    alert(`Compartilhar ${title}! (funcionalidade a implementar)`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Link
        href={detailLink}
        passHref
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <CardActionArea
          sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <CardMedia
            component="img"
            className="h-52 object-cover"
            image={image}
            alt={alt}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions className="justify-end mt-auto">
        <IconButton aria-label="compartilhar" onClick={handleShareClick}>
          <FaShare size={24} className="text-gray-500" />
        </IconButton>
        <IconButton aria-label="curtir" onClick={handleLikeClick}>
          {isLike ? (
            <FaHeart size={24} className="text-red-500" />
          ) : (
            <FaRegHeart size={24} className="text-gray-500" />
          )}
        </IconButton>
      </CardActions>
    </Card>
  );
}
