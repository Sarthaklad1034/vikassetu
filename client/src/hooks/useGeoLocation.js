import { useState, useEffect } from "react";

const useGeoLocation = () => {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        const success = (position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            });
        };

        const fail = (error) => {
            setError(error.message);
        };

        navigator.geolocation.getCurrentPosition(success, fail);
    }, []);

    return { location, error };
};

export default useGeoLocation;