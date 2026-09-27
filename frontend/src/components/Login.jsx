import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: user,
          password: pass,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`❌ ${data.message || "Usuario o contraseña incorrectos."}`);
        return;
      }

      // Guardar el token recibido del backend
      if (remember) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
      }

      alert("✅ Acceso concedido. ¡Bienvenido!");

      navigate("/principal");
    } catch (error) {
      console.error("Error al conectar con el backend:", error);

      alert(
        "❌ No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503264116251-35a269479413')",
      }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full"
          />
        </div>

        <h2 className="text-2xl font-bold mb-6">
          ¡Bienvenido!
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="p-2 rounded border"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="p-2 rounded border"
            required
            disabled={loading}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Recordarme
            </label>

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-blue-600 hover:underline"
            >
              ¿Eres un nuevo usuario?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;

