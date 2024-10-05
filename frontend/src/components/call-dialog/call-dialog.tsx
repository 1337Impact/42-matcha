import { useContext, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { SocketContext } from "../../contexts/SocketContext";
import { getProfileData } from "../../pages/profile/utils";
import { FaPhone, FaPhoneSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export function CallDialog() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const [caller, setCaller] = useState("");
  const [callerId, setCallerId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    socket?.on("incoming-call", (data) => {
      setCallerId(data.sender_id);
      getProfileData(data.sender_id).then((profile) => {
        setCaller(profile.first_name + " " + profile.last_name);
        setIsOpen(true);
      });
    });
  }, [socket]);

  const handleAnswer = () => {
    navigate(`/chat/${callerId}/video-call?answer=true`);
  };

  const handleCancel = () => {
    setIsOpen(false);
    socket?.emit("rtc-message", { receiver_id: callerId, type: "bye" });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You have a call from {caller}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={handleCancel}
            className="text-[1.05rem] bg-red-500 text-white hover:text-white hover:bg-red-600 flex items-center gap-2"
          >
            Cancel <FaPhoneSlash size={24} />
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAnswer}
            className="text-[1.05rem] bg-green-500 hover:bg-green-600 flex items-center gap-2"
          >
            Answer <FaPhone size={24} />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
