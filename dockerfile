# Usa una imagen base
FROM python:3.9-slim

# Establece el directorio de trabajo
WORKDIR /Escritorio/entrega_desarrollo/4ctrl_Lautaro

# Copia el archivo de requisitos
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto del código
COPY . .

# Expone el puerto
EXPOSE 5000

ENV FLASK_APP=app.py

# Comando para iniciar la aplicación
CMD ["flask", "run", "--host=0.0.0.0"]
