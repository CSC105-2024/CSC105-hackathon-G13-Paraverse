import React, { useState } from 'react';

const Home = () => {
    const [activeTab, setActiveTab] = useState('Home');
    const [showPostModal, setShowPostModal] = useState(false);
    const [scenarios, setScenarios] = useState([]);
    const [newScenario,setNewScenario] = useState({
        category: 'History',
        title: '',
        description: '',
        author: 'Anonymous'
    });

const handleInputChange = (field, value) => {
    setNewScenario(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSybmitScenario = () => {
    if(newScenario.title.trim() && newScenario.description.trim()){
        const scenario = {
            id: Date.now(),
            category: newScenario.category,
            description: newScenario.description,
            author: newScenario.author,
            date: new Date().toLocaleDateString('en-US',{
                year:'numeric',
                month: 'short',
                day:'numeric'
            }),
            vote:0,
            comments:0
        };
        setScenarios(prev =>[scenario,...prev])
    }
  }
}