import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  welcomeTitle: string;
  welcomeDescription: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, side, welcomeTitle, welcomeDescription }) => {
  const isFormLeft = side === 'left';

  return (
    <div className="flex min-h-screen w-full bg-brand-950 text-white overflow-hidden">
      {/* Welcome Side */}
      <div className={`hidden lg:flex flex-col justify-center px-16 xl:px-24 flex-1 relative bg-brand-900 ${isFormLeft ? 'order-2 border-l border-brand-700' : 'order-1 border-r border-brand-700'}`}>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight text-white">
            {welcomeTitle}
          </h1>
          <p className="text-lg text-brand-muted leading-relaxed">
            {welcomeDescription}
          </p>
          <div className="h-px w-16 bg-white opacity-30" />
        </div>
      </div>

      {/* Form Side */}
      <div className={`flex flex-col justify-center items-center w-full lg:w-[480px] xl:w-[520px] min-h-screen px-6 sm:px-12 lg:px-16 bg-brand-950 ${isFormLeft ? 'order-1' : 'order-2'}`}>
        {/* Mobile Welcome */}
        <div className="lg:hidden text-center mb-8 mt-10">
          <h1 className="text-3xl font-bold mb-2">{welcomeTitle}</h1>
          <p className="text-brand-muted text-sm">{welcomeDescription}</p>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
