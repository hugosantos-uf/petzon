import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Configuração base do Next.js
const baseNextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080", // Especifique a porta do seu backend
        pathname: "/fotos/**",
      },
      {
        protocol: "https",
        // Substitua pelo hostname correto do seu bucket S3.
        // O formato é geralmente: <nome-do-bucket>.s3.<regiao>.amazonaws.com
        hostname: "petzon-images.s3.amazonaws.com",
        port: "",
        pathname: "/**", // Permite qualquer imagem dentro do bucket
      },
      {
        protocol: "https",
        // Substitua pelo hostname correto do seu bucket S3.
        // O formato é geralmente: <nome-do-bucket>.s3.<regiao>.amazonaws.com
        hostname: "petzon-images.s3.us-east-2.amazonaws.com",
        port: "",
        pathname: "/**", // Permite qualquer imagem dentro do bucket
      },

      {
        protocol: "https",
        hostname: "cdn2.thecatapi.com",
        port: "",
        pathname: "/images/**", // Permite qualquer caminho dentro de /images/
      },
      {
        protocol: "https",
        hostname: "cdn2.thedogapi.com",
        port: "",
        pathname: "/images/**", // Permite qualquer caminho dentro de /images/
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // A regra a seguir aplica-se apenas ao build do cliente (navegador)
    if (!isServer) {
      // O 'fallback' diz ao Webpack o que fazer quando não encontra um módulo.
      // Ao definir como 'false', ele simplesmente o ignora.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false, // Ignora o módulo 'net'
        tls: false, // É uma boa prática ignorar o 'tls' também, pois pode causar problemas semelhantes
      };
    }

    return config;
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(baseNextConfig);
