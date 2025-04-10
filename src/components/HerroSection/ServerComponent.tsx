import Image from 'next/image';


// serverHeading.tsx (or wherever you define this)
export const headingText = {
    title: "Explore Munawara",
    description: `Experience the best of hospitality with Munawara. Our rooms are designed to provide you with comfort and luxury, ensuring a memorable stay. Whether you're here for business or leisure, we have the perfect room for you.`,
};


const strimages = process.env.HERRO_SECTION_IMAGES as string;
const images = strimages.split(',');
const imageUrls = images.map((image) => image.trim());


export const imagesSection = <>
    <div className='flex-1 flex flex-col gap-6 justify-center'>
        {/* Large Top Image */}
        <div className='rounded-2xl overflow-hidden h-48 sm:h-50 flex justify-center ml-12'>
            <Image
                src={imageUrls[0]}
                alt='Hotel Interior'
                width={400}
                height={400}
                className='img scale-animation w-full object-cover'
            />
        </div>

        {/* Two Smaller Images Below */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            <div className='rounded-2xl overflow-hidden h-40 sm:h-48 flex justify-center ml-12'>
                <Image
                    src={imageUrls[1]}
                    alt='Luxury Room'
                    width={300}
                    height={300}
                    className='img scale-animation w-full object-cover'
                />
            </div>
            <div className='rounded-2xl overflow-hidden h-40 sm:h-48 flex justify-center'>
                <Image
                    src={imageUrls[2]}
                    alt='Cozy Room'
                    width={300}
                    height={300}
                    className='img scale-animation w-full object-cover'
                />
            </div>
        </div>
    </div>
</>




