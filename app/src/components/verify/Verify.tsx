/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "flowbite-react";

export function Verify() {
  const navigate = useNavigate();
  const params = useParams();
  const { verify } = useAuth();
  useEffect(() => {
    if (params.id) {
      verify(
        params.id,
        () => {
          navigate("/", { replace: true });
        },
        () => {
          navigate("/", { replace: true });
        }
      );
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Spinner color="purple" />
      </div>
    </div>
  );
}
