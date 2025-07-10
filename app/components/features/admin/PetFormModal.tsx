"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Pet } from "@/app/types/interfaces";
import {
  useAddPetMutation,
  useUpdatePetMutation,
} from "@/app/store/api/petsApi";
import { FiX } from "react-icons/fi";
import { PetCadastroDto } from "@/app/types/interfaces";

interface PetFormInputs extends PetCadastroDto {
  imagem: FileList;
}

interface PetFormModalProps {
  pet?: Pet | null;
  onClose: () => void;
}

export default function PetFormModal({ pet, onClose }: PetFormModalProps) {
  const isEditMode = !!pet;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PetFormInputs>();

  const [addPet, { isLoading: isAdding }] = useAddPetMutation();
  const [updatePet, { isLoading: isUpdating }] = useUpdatePetMutation();

  useEffect(() => {
    if (isEditMode && pet) {
      const petDataForForm = { ...pet, idade: Number(pet.idade) };
      reset(petDataForForm);
    } else {
      reset();
    }
  }, [pet, isEditMode, reset]);

  const onSubmit: SubmitHandler<PetFormInputs> = async (data) => {
    const formData = new FormData();

    formData.append("nome", data.nome);
    formData.append("tipo", data.tipo);
    formData.append("temperamento", data.temperamento);
    formData.append("idade", String(data.idade));
    formData.append("descricao", data.descricao || "");

    if (data.imagem && data.imagem.length > 0) {
      formData.append("foto", data.imagem[0]);
    } else if (!isEditMode) {
      alert("Uma imagem é obrigatória para cadastrar um novo pet.");
      return;
    }

    try {
      if (isEditMode && pet) {
        if (!data.imagem || data.imagem.length === 0) {
          alert(
            "Para atualizar, por favor, selecione a imagem atual novamente ou uma nova imagem."
          );
          return;
        }
        await updatePet({ id: pet.id, formData }).unwrap();
        alert("Pet atualizado com sucesso!");
      } else {
        await addPet(formData).unwrap();
        alert("Pet cadastrado com sucesso!");
      }
      onClose();
    } catch (err) {
      console.error("Falha ao salvar o pet:", err);
      alert(
        "Ocorreu um erro ao salvar o pet. Verifique os dados e tente novamente."
      );
    }
  };

  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg relative max-h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          {isEditMode ? "Editar Pet" : "Adicionar Novo Pet"}
        </h2>

        {/* *** INÍCIO DO FORMULÁRIO COMPLETO *** */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="nome">
              Nome
            </label>
            <input
              id="nome"
              {...register("nome", { required: "Nome é obrigatório" })}
              className={inputClass}
            />
            {errors.nome && <p className={errorClass}>{errors.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="tipo">
                Tipo
              </label>
              <select
                id="tipo"
                {...register("tipo", { required: "Tipo é obrigatório" })}
                className={inputClass}
              >
                <option value="GATO">Gato</option>
                <option value="CACHORRO">Cachorro</option>
              </select>
              {errors.tipo && (
                <p className={errorClass}>{errors.tipo.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="idade">
                Idade (anos)
              </label>
              <input
                id="idade"
                type="number"
                {...register("idade", {
                  required: "Idade é obrigatória",
                  min: { value: 0, message: "Idade não pode ser negativa" },
                })}
                className={inputClass}
              />
              {errors.idade && (
                <p className={errorClass}>{errors.idade.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="temperamento">
              Temperamento
            </label>
            <input
              id="temperamento"
              {...register("temperamento", {
                required: "Temperamento é obrigatório",
              })}
              className={inputClass}
              placeholder="Ex: Calmo e dócil"
            />
            {errors.temperamento && (
              <p className={errorClass}>{errors.temperamento.message}</p>
            )}
          </div>

          <div>
            <label className={labelClass} htmlFor="descricao">
              Descrição
            </label>
            <textarea
              id="descricao"
              {...register("descricao")}
              className={inputClass}
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className={labelClass} htmlFor="imagem">
              Imagem do Pet
            </label>
            <input
              id="imagem"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              {...register("imagem", { required: !isEditMode })} // Obrigatório apenas na criação
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            />
            {errors.imagem && (
              <p className={errorClass}>Uma imagem é obrigatória.</p>
            )}
            {isEditMode && (
              <p className="text-xs text-gray-500 mt-1">
                Para atualizar, selecione a imagem novamente ou escolha uma
                nova.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isAdding || isUpdating}
              className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 disabled:bg-purple-400"
            >
              {isAdding || isUpdating ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
        {/* *** FIM DO FORMULÁRIO COMPLETO *** */}
      </div>
    </div>
  );
}
