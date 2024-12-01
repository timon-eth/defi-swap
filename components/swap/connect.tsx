import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';

export const Connect = () => {
  const [opensheet, setOpensheet] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Close sheet when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setOpensheet(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');
          return (
            <div className='ml-auto mr-4 w-full'>
              {(() => {
                if (!connected) {
                  return (
                    <Button className='w-full rounded-xl bg-neutral-500' onClick={openConnectModal}>
                      Connect Wallet
                    </Button>
                  );
                }
                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openConnectModal}
                      className='before:ease relative h-8 w-36 rounded-xl overflow-hidden bg-[#262626] text-white transition-all before:absolute before:top-1/2 before:h-0 before:w-48 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-neutral-700 before:duration-300 hover:sbg-neutral-700 hover:before:h-64 hover:before:-translate-y-32'
                      style={{ boxShadow: "2px 2px 5px 1px #262626" }}
                    >
                      <span className="relative z-10">Wrong network</span>
                    </button>
                  );
                }
                return (
                  <button
                    onClick={() => setOpensheet(true)}
                    className='before:ease relative h-8 w-36 rounded-xl overflow-hidden bg-[#262626] text-white transition-all before:absolute before:top-1/2 before:h-0 before:w-48 before:origin-center before:-translate-x-20 before:rotate-45 before:bg-neutral-700 before:duration-300 hover:sbg-neutral-700 hover:before:h-64 hover:before:-translate-y-32'
                    style={{ boxShadow: "2px 2px 5px 1px #262626" }}
                  >
                    <span className="relative z-10 flex flex-row px-2"><img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      style={{ width: 24, height: 24 }}
                      className='chain-icon mx-1'
                    />
                      {account.displayName}</span>
                  </button>
                );
              })()}

            </div>
          );
        }}
      </ConnectButton.Custom>
      <Sheet open={opensheet}>
        <SheetContent ref={sheetRef}>
          <SheetHeader>
            <h1>Setting Wallet</h1>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  );
};