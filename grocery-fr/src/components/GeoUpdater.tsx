"use client";
import { getSocket } from "@/lib/socket";
import { useEffect } from "react";

function GeoUpdater({ userId }: { userId: string }) {
  let socket = getSocket();
  useEffect(() => {
    if (!userId) return;
    // emit event in frontend like this and in backend listen with this socket.on('identity',(data)=>{here we can access data that send from frontend})
    const socket = getSocket();
    socket.emit("identity", userId);
  }, [userId]);
  //   if live location watch then use this
  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit("updateLocation", { userId, latitude, longitude });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userId]);
  return <div></div>;
}

export default GeoUpdater;
