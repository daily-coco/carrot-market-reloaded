interface IFormInputProps {
    type : string;
    name : string;
    placehoder :string;
    required :boolean;
    errors :string[]; // string 타입의 배열로 지정하는 것은 에러가 여러개일 수도 있기 때문에
}

export default function  FormInput({type, name, placehoder, required, errors}:IFormInputProps) {
    return (
        <div className='flex flex-col gap-2'>  
            <input 
                type={type} 
                name={name}
                placeholder={placehoder}  
                required={required}
                className='px-2 bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
            />
            {errors.map((error,index) => (
                <span key={index} className='text-red-500 font-medium'>
                    {error}
                </span>
            ))}
        </div>
    )
}