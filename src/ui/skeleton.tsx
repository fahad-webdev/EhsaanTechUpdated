import React from 'react'
import { Skeleton } from 'primereact/skeleton';

 const SkeletonForm = () => (
     <div className="flex align-items-center justify-content-center my-6 border-round">
       <div className="surface-card p-4 shadow-2 border-round w-full lg:w-10">
         <div className="text-center flex align-items-center justify-content-center mb-5">
           <Skeleton width="10rem" height="2rem" className="mb-2" />
         </div>
 
         <div className="space-y-4">
           {/* Short Description Skeleton */}
           <Skeleton width="100%" height="3rem" className="mb-4" />
 
           {/* Dropdowns Skeleton */}
           <div className="flex flex-wrap gap-4">
             <Skeleton
               width="100%"
               height="3rem"
               className="flex-1 min-w-[200px]"
             />
             <Skeleton
               width="100%"
               height="3rem"
               className="flex-1 min-w-[200px]"
             />
             <Skeleton
               width="100%"
               height="3rem"
               className="flex-1 min-w-[200px]"
             />
           </div>
 
           {/* Combined Text Input Skeleton */}
           <Skeleton width="100%" height="3rem" className="mt-5" />
 
           {/* Submit Button Skeleton */}
           <div className="flex justify-content-center align-items-center mt-5">
             <Skeleton width="10rem" height="3rem" borderRadius="16px" />
           </div>
         </div>
       </div>
     </div>
   );

export default SkeletonForm