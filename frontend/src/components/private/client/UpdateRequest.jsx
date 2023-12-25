import { useState } from "react";
import { toast } from 'react-toastify'
import { useDataContext, useAuthContext } from "../../../hooks/useContexts";

export default function UpdateRequest({request_id}){
    const {dispatch} = useDataContext();
    const {user} = useAuthContext();

    const [formData, setFormData] = useState({
        message: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (request_id === ''){
            toast.error('Please select one request to update')
            return;
        }
        const data = JSON.stringify(formData);

        try {
            const response = await fetch(`/api/requests/client_requests/${request_id}`, {
                method: 'PATCH',
                body: data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const res = await response.json();
    
            if(!response.ok){
                toast.error(res.error)
            }
            if(response.ok){
                toast.success('Updated a request successfully');
                setFormData({
                    message: '',
                    id: ''
                });
    
                const update = await fetch('/api/requests/client_requests', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const json = await update.json();
    
                if(update.ok){
                    dispatch({type: 'SET_REQUESTS', payload: json})
                }
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setFormData({
            message: '',
            id: ''
        })
    }

    return ( 
        <form className="other-forms" onSubmit={handleSubmit} onReset={handleReset}>
            <h3>Update Request</h3>

            <label>Request ID(Click the request):</label>
            <input
                type="text"
                name="id"
                disabled
                value={request_id}
            />

            <label>Message:</label>
            <textarea
                name="message"
                onChange={handleInputChange}
                value={formData.message}
            />

            <input className="submit" type="submit" value="Update"/>
            <input className="cancel" type="reset" value="Cancel"/>
        </form>
     );
}