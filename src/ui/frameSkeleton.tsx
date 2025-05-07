import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';

const CardAccordionSkeleton = () => {
  return (
    <Card className="shadow-lg">
      <div className="text-center mb-4">
        <Skeleton width="50%" height="2rem" className="mb-2" />
        <Skeleton width="30%" height="1.5rem" />
      </div>
      <Accordion>
        {[1, 2, 3].map((index) => (
          <AccordionTab
            key={index}
            headerTemplate={
              <div className="flex justify-content-between items-center w-full p-2">
                <Skeleton width="70%" height="1.5rem" />
                <div className="flex gap-2">
                  <Skeleton shape="circle" size="2rem" />
                  <Skeleton shape="circle" size="2rem" />
                </div>
              </div>
            }
          >
            <div className="flex justify-content-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((imageIndex) => (
                  <Card key={imageIndex} className="shadow-lg cursor-pointer border-round-xl">
                    <div className="rounded-xl overflow-hidden">
                      <Skeleton width="100%" height="200px" />
                    </div>
                    <div className="flex justify-content-end">
                      <Skeleton shape="circle" size="2rem" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </AccordionTab>
        ))}
      </Accordion>
    </Card>
  );
};

export default CardAccordionSkeleton;