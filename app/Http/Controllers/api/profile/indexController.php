<?php

namespace App\Http\Controllers\api\profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Helper\fileupload;
use App\Models\User;
class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        return response()->json([
            'success'=>true,
            'user'=>$user
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = request()->user();
        $all = $request->all();
        //Log::info(json_encode($request->all()));
        $control = User::where('email',$all['email'])->where('id','!=',$user->id)->count();
        if($control != 0){ return response()->json(['success'=>false,'message'=>'Bu Email kullanımda']);}
        if($all['password']!=null && $all['password']!=''){
            $all['password'] = md5($all['password']);
        }
        else 
        {
            unset($all['password']);
        }
        $all['photo'] = fileUpload::changeUpload(rand(1,9000),"photo",$request->file('file'),0,$user,"photo");
        unset($all['_method']);
        unset($all['file']);
        User::where('id',$user->id)->update($all);
        return response()->json(['success'=>true,'message'=>'Bilgiler Düzenlendi']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
