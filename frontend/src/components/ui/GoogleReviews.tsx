import { useEffect } from "react";

const GoogleReviews = () => {
    useEffect(() => {
        // This effect ensures the script runs when the component mounts
        // if the user pastes a script tag that needs execution.
        // However, most Elfsight widgets are just a div and a script in basic HTML.
        // The script is usually placed in index.html or here if it supports dynamic loading.
    }, []);

    return (
        <div className="container mx-auto px-4 lg:px-8 py-24">
            <div className="text-center mb-16">
                <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
                    Client Love
                </p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
                    What Our Customers Say
                </h2>
            </div>

            <div className="elfsight-app-77cd1f6b-9b37-46d8-97d2-227b8ca4089f" data-elfsight-app-lazy></div>
        </div>
    );
};

export default GoogleReviews;
