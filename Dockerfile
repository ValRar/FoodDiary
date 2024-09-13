#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY FoodDiaryWebApi/*.csproj ./FoodDiaryWebApi/
RUN dotnet restore

# copy everything else and build app
COPY FoodDiaryWebApi/. ./FoodDiaryWebApi/
WORKDIR /source/FoodDiaryWebApi
RUN dotnet publish -c release -o /out --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out ./
COPY certificates/ /usr/local/share/ca-certificates/
RUN update-ca-certificates -v
EXPOSE 8080
ENTRYPOINT ["dotnet", "FoodDiaryWebApi.dll"]