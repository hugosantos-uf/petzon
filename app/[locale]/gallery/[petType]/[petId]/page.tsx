"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useGetPetByIdQuery } from "@/app/store/api/petsApi";
import { useGetUsuarioLogadoQuery } from "@/app/store/api/authApi";
import Image from "next/image";
import { useAppSelector } from "@/app/hooks/hooks";
import PrivateChatWindow from "@/app/components/features/chat/PrivateChatWindow";
import { FiMessageSquare } from "react-icons/fi";

export default function PetDetailPage() {
  const params = useParams();
  const petId = params.petId as string;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: currentUser } = useGetUsuarioLogadoQuery(undefined, {
    skip: !isAuthenticated,
  });
  const {
    data: pet,
    error,
    isLoading,
  } = useGetPetByIdQuery(petId, { skip: !petId });

  const conversationId = currentUser
    ? `${currentUser.idUsuario}-${petId}`
    : null;

  if (isLoading) {
    return (
      <main className="flex-1 bg-purple-50 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-700"></div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="flex-1 bg-purple-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto text-center">
          Falha ao buscar detalhes do pet.
        </div>
      </main>
    );
  }

  const imageUrl = pet.urlFoto;

  return (
    <>
      <main className="flex-1 bg-purple-50 py-8 px-4 md:px-6">
        <div className="bg-white max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl">
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={imageUrl}
              alt={pet.nome}
              layout="fill"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-950 mb-4">
              {pet.nome}
            </h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                Temperamento:
              </h2>
              <div className="flex flex-wrap gap-2">
                {pet.temperamento.split(" e ").map((temp) => (
                  <span
                    key={temp}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {temp}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-1">
                Descrição:
              </h2>
              <p className="text-gray-700 leading-relaxed">{pet.descricao}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-1">
                Idade:
              </h2>
              <p className="text-gray-700">{pet.idade} anos</p>
            </div>
          </div>
        </div>
      </main>

      {isAuthenticated &&
        currentUser?.idUsuario !== pet.responsavel?.idUsuario && (
          <div
            className={`fixed z-50 transition-all duration-300 ease-in-out
              ${
                isChatOpen
                  ? "inset-0 md:bottom-6 md:right-6 md:top-auto md:left-auto"
                  : "bottom-6 right-6"
              }
            `}
          >
            <div
              className={`transition-all duration-300 ease-in-out h-full
              ${isChatOpen ? "w-full md:w-96 md:h-[500px]" : "w-16 h-16"}
            `}
            >
              {isChatOpen && conversationId ? (
                <PrivateChatWindow
                  conversationId={conversationId}
                  chatPartnerName={pet.responsavel?.nome || "Responsável"}
                  onClose={() => setIsChatOpen(false)}
                />
              ) : (
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="w-16 h-16 bg-purple-700 rounded-full text-white flex items-center justify-center shadow-lg hover:bg-purple-800 transition-transform hover:scale-110"
                  aria-label="Abrir chat"
                >
                  <FiMessageSquare size={28} />
                </button>
              )}
            </div>
          </div>
        )}
    </>
  );
}
