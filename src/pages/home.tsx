import { useAuth } from "@/components/providers/AuthContext";
import { Card, CardBody, Avatar } from "@heroui/react";
import { motion, type Variants } from "framer-motion";
import {
  LuBookText,
  LuGrid2X2Plus,
  LuUsers,
  LuMail,
  LuImage,
  LuChevronRight,
} from "react-icons/lu";
import { useNavigate } from "react-router";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const shortcuts = [
    {
      title: "Proyectos",
      description: "Gestiona el portafolio y los casos de éxito.",
      icon: <LuGrid2X2Plus size={28} className="text-primary" />,
      color: "bg-primary/10",
      path: "/project",
    },
    {
      title: "Blog",
      description: "Publica y administra artículos y categorías.",
      icon: <LuBookText size={28} className="text-secondary" />,
      color: "bg-secondary/10",
      path: "/blog",
    },
    {
      title: "Contactos",
      description: "Revisa y responde mensajes de clientes.",
      icon: <LuMail size={28} className="text-success" />,
      color: "bg-success/10",
      path: "/contact",
    },
    {
      title: "Galería",
      description: "Sube y administra tus recursos gráficos.",
      icon: <LuImage size={28} className="text-warning" />,
      color: "bg-warning/10",
      path: "/galery",
    },
    {
      title: "Clientes",
      description: "Administra el listado de tus clientes activos.",
      icon: <LuUsers size={28} className="text-danger" />,
      color: "bg-danger/10",
      path: "/client",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
  };

  return (
    <div className="w-full h-full p-6 lg:p-10 flex flex-col gap-10 max-w-7xl mx-auto">
      {/* Hero Welcome Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-[#121212] border border-zinc-800 p-8 lg:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
      >
        {/* Background Decorative Blur */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-white">
            ¡Hola,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {user?.fullName || user?.username || "Equipo"}
            </span>
            ! 👋
          </h1>
          <p className="text-zinc-400 text-lg mt-2 max-w-xl">
            Bienvenido de nuevo al panel de administración. ¿Qué te gustaría
            hacer hoy? Aquí tienes accesos rápidos a las secciones más
            importantes.
          </p>
        </div>

        <div className="relative z-10 hidden md:block">
          <Avatar
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            className="w-32 h-32 text-large shadow-xl border-4 border-zinc-800"
            isBordered
            color="primary"
          />
        </div>
      </motion.section>

      {/* Quick Access Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold px-2">Accesos Rápidos</h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {shortcuts.map((shortcut, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card
                isPressable
                className="w-full h-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors group"
                onPress={() => navigate(shortcut.path)}
              >
                <CardBody className="p-6 flex flex-col gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${shortcut.color}`}
                  >
                    {shortcut.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold">{shortcut.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {shortcut.description}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">
                    Ir a {shortcut.title.toLowerCase()}
                    <LuChevronRight
                      size={16}
                      className="ml-1 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
